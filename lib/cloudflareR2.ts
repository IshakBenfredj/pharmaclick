import crypto from 'crypto';

export interface PresignedUrlOptions {
  key: string;
  contentType?: string;
  expiresInSeconds?: number;
}

export interface PresignedUrlResult {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

/**
 * توليد رابط رفع موقّع مسبقاً (Cloudflare R2 S3-Compatible Pre-signed URL)
 *
 * @description
 * يستخدم بروتوكول AWS Signature Version 4 (SigV4) المتوافق 100% مع Cloudflare R2
 * لتوليد رابط PUT موقع ومحدد الصلاحية (15 دقيقة) يتيح للواجهة رفع الصور مباشرة إلى R2
 * بدون استهلاك موارد السيرفر، مع توفير الرابط العام (Public URL) النهائي.
 */
export function generateR2PresignedPutUrl({
  key,
  contentType,
  expiresInSeconds = 900,
}: PresignedUrlOptions): PresignedUrlResult {
  const accountId = (process.env.CLOUDFLARE_R2_ACCOUNT_ID || 'c8f12a34b567890abcdef1234567890a').trim();
  const accessKeyId = (process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || 'a1b2c3d4e5f678901234567890abcdef').trim();
  const secretAccessKey = (process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '1234567890abcdef1234567890abcdef').trim();
  const bucketName = (process.env.CLOUDFLARE_R2_BUCKET_NAME || 'pharmaclick-media').trim();
  const publicBaseUrl = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-a1b2c3d4e5f6.r2.dev').replace(/\/+$/, '');

  const host = `${accountId}.r2.cloudflarestorage.com`;
  const region = 'auto';
  const service = 's3';

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);

  const credential = `${accessKeyId}/${dateStamp}/${region}/${service}/aws4_request`;

  // Encode key path
  const cleanKey = key.replace(/^\/+/, '');
  const encodedPath = `/${bucketName}/${encodeURIComponent(cleanKey).replace(/%2F/g, '/')}`;

  // Query parameters in alphabetical order
  const queryParams = new URLSearchParams();
  queryParams.set('X-Amz-Algorithm', 'AWS4-HMAC-SHA256');
  queryParams.set('X-Amz-Credential', credential);
  queryParams.set('X-Amz-Date', amzDate);
  queryParams.set('X-Amz-Expires', expiresInSeconds.toString());
  queryParams.set('X-Amz-SignedHeaders', 'host');

  const canonicalQueryString = queryParams.toString();
  const canonicalHeaders = `host:${host}\n`;
  const signedHeaders = 'host';
  const payloadHash = 'UNSIGNED-PAYLOAD';

  const canonicalRequest = [
    'PUT',
    encodedPath,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const canonicalRequestHash = crypto.createHash('sha256').update(canonicalRequest, 'utf8').digest('hex');

  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    canonicalRequestHash,
  ].join('\n');

  // Derive signing key: HMAC-SHA256(HMAC-SHA256(HMAC-SHA256(HMAC-SHA256("AWS4" + secret, date), region), service), "aws4_request")
  const kDate = crypto.createHmac('sha256', `AWS4${secretAccessKey}`).update(dateStamp, 'utf8').digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(region, 'utf8').digest();
  const kService = crypto.createHmac('sha256', kRegion).update(service, 'utf8').digest();
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request', 'utf8').digest();

  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign, 'utf8').digest('hex');

  queryParams.set('X-Amz-Signature', signature);

  const uploadUrl = `https://${host}${encodedPath}?${queryParams.toString()}`;
  const publicUrl = `${publicBaseUrl}/${cleanKey}`;

  return {
    uploadUrl,
    publicUrl,
    key: cleanKey,
  };
}
