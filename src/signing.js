/*
 * Minio Javascript Library for Amazon S3 Compatible Cloud Storage, (C) 2016 Minio, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Moment = require('moment')
var Crypto = require('crypto')

var signV4 = (request, dataShaSum256, accessKey, secretKey) => {
      if (!accessKey || !secretKey) {
        return
      }
      var requestDate = Moment().utc()
      if (!dataShaSum256) {
        dataShaSum256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      }

      if (!request.headers) {
        request.headers = {}
      }

      var region = 'milkyway',
          host = request.host

      if ((request.scheme === 'http' && request.port !== 80) || (request.scheme === 'https' && request.port !== 443)) {
        host = `${host}:${request.port}`
      }

      request.headers.host = host
      request.headers['x-minio-date'] = requestDate.format('YYYYMMDDTHHmmss') + 'Z'
      request.headers['x-minio-content-sha256'] = dataShaSum256

      var canonicalRequestAndSignedHeaders = getCanonicalRequest(request, dataShaSum256),
          canonicalRequest = canonicalRequestAndSignedHeaders[0],
          signedHeaders = canonicalRequestAndSignedHeaders[1],
          hash = Crypto.createHash('sha256')

      hash.update(canonicalRequest)

      var canonicalRequestHash = hash.digest('hex'),
          stringToSign = getStringToSign(canonicalRequestHash, requestDate, region),
          signingKey = getSigningKey(requestDate, region, secretKey),
          hmac = Crypto.createHmac('sha256', signingKey)

      hmac.update(stringToSign)

      var signedRequest = hmac.digest('hex').toLowerCase().trim(),
          credentials = `${accessKey}/${requestDate.format('YYYYMMDD')}/${region}/rpc/rpc_request`,
          authorization = `Credential=${credentials}, SignedHeaders=${signedHeaders}, Signature=${signedRequest}`

      request.headers.authorization = 'MINIORPC ' + authorization

      function getCanonicalRequest(request, dataShaSum1) {
        var headerKeys = [],
            headers = [],
            ignoredHeaders = ['Authorization', 'Content-Length', 'Content-Type', 'User-Agent']

        // Excerpts from @lsegal - https://github.com/aws/aws-sdk-js/issues/659#issuecomment-120477258
        //
        //  User-Agent:
        //
        //      This is ignored from signing because signing this causes problems with generating pre-signed URLs
        //      (that are executed by other agents) or when customers pass requests through proxies, which may
        //      modify the user-agent.
        //
        //  Content-Length:
        //
        //      This is ignored from signing because generating a pre-signed URL should not provide a content-length
        //      constraint, specifically when vending a S3 pre-signed PUT URL. The corollary to this is that when
        //      sending regular requests (non-pre-signed), the signature contains a checksum of the body, which
        //      implicitly validates the payload length (since changing the number of bytes would change the checksum)
        //      and therefore this header is not valuable in the signature.
        //
        //  Content-Type:
        //
        //      Signing this header causes quite a number of problems in browser environments, where browsers
        //      like to modify and normalize the content-type header in different ways. There is more information
        //      on this in https://github.com/aws/aws-sdk-js/issues/244. Avoiding this field simplifies logic
        //      and reduces the possibility of future bugs
        //
        //  Authorization:
        //
        //      Is skipped for obvious reasons

        for (var key in request.headers) {
          if (request.headers.hasOwnProperty(key) && ignoredHeaders.indexOf(key) === -1) {
            var value = request.headers[key]
            headers.push(`${key.toLowerCase()}:${value}`)
            headerKeys.push(key.toLowerCase())
          }
        }

        headers.sort()
        headerKeys.sort()

        var signedHeaders = ''
        headerKeys.forEach(element => {
          if (signedHeaders) {
            signedHeaders += ';'
          }
          signedHeaders += element
        })

        var splitPath = request.path.split('?'),
            requestResource = splitPath[0],
            requestQuery = ''

        if (splitPath.length === 2) {
          requestQuery = splitPath[1]
            .split('&')
            .sort()
            .map(element => {
              if (element.indexOf('=') === -1) {
                element = element + '='
              }
              return element
            })
            .join('&')
        }

        var canonicalString = ''
        canonicalString += canonicalString + request.method.toUpperCase() + '\n'
        canonicalString += requestResource + '\n'
        canonicalString += requestQuery + '\n'
        headers.forEach(element => {
          canonicalString += element + '\n'
        })
        canonicalString += '\n'
        canonicalString += signedHeaders + '\n'
        canonicalString += dataShaSum1
        return [canonicalString, signedHeaders]
      }
    }

var getSigningKey = function(date, region, secretKey) {
      var key = 'MINIO' + secretKey,
          dateLine = date.format('YYYYMMDD'),
          hmac1 = Crypto.createHmac('sha256', key).update(dateLine).digest('binary'),
          hmac2 = Crypto.createHmac('sha256', hmac1).update(region).digest('binary'),
          hmac3 = Crypto.createHmac('sha256', hmac2).update('rpc').digest('binary')
      return Crypto.createHmac('sha256', hmac3).update('rpc_request').digest('binary')
    }

var getStringToSign = function(canonicalRequestHash, requestDate, region) {
      var stringToSign = 'MINIORPC\n'
      stringToSign += requestDate.format('YYYYMMDDTHHmmss') + 'Z\n'
      stringToSign += `${requestDate.format('YYYYMMDD')}/${region}/rpc/rpc_request\n`
      stringToSign += canonicalRequestHash
      return stringToSign
    }

module.exports = signV4
