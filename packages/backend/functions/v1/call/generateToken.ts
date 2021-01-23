import * as functions from 'firebase-functions';
import { RtcTokenBuilder, Role } from '@/src/rtcTokenBuilder';

export const generateToken = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    return {
      status: 403,
      message: 'unauthentication',
    };
  }

  const appID = functions.config()?.env?.appid;
  const appCertificate = functions.config()?.env?.certificate;
  const channelName = data?.channelName as string | undefined;
  const uid = data?.uid as string | undefined;

  if (!appID || !appCertificate) {
    return {
      status: 500,
      message: 'config not set',
    };
  }

  if (!channelName || !uid) {
    return {
      status: 500,
      message: 'parameters not set',
    };
  }

  const pattern = /^\d+$/;
  if (!pattern.test(uid)) {
    return {
      status: 500,
      message: 'uid is number only',
    };
  }

  try {
    const role = Role.PUBLISHER;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const tokenA = await RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName as string,
      Number(uid as string),
      role,
      privilegeExpiredTs,
    );
    console.log('Token With Integer Number Uid: ' + tokenA);
    return {
      status: 201,
      data: {
        token: tokenA,
      },
    };
  } catch (error) {
    return {
      status: error.code,
      message: error.message,
    };
  }
});
