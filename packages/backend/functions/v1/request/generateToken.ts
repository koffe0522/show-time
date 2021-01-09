import * as functions from 'firebase-functions';
import { RtcTokenBuilder, Role } from '../../src/rtcTokenBuilder';

export const generateToken = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'GET') {
    res.status(400).send('error');
    return;
  }

  const appID = functions.config()?.env?.appid;
  const appCertificate = functions.config()?.env?.certificate;
  const channelName = req.query?.channelName;
  const uid = req.query?.uid;

  if (!appID || !appCertificate) {
    res.status(400).send('config not set');
    return;
  }

  if (!channelName || !uid) {
    res.status(400).send('Query parameters not set');
    return;
  }

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
  res.status(200).send(tokenA);
});
