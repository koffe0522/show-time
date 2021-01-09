import * as functions from 'firebase-functions';
import { RtcTokenBuilder, Role } from '../../src/rtcTokenBuilder';

export const generateToken = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'GET') {
    res.status(400).send('error');
    return;
  }

  const appID = '970CA35de60c44645bbae8a215061b33';
  const appCertificate = '5CFd2fd1755d40ecb72977518be15d3b';
  const channelName = '7d72365eb983485397e3e3f9d460bdda';
  const uid = 2882341273;
  const role = Role.PUBLISHER;

  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const tokenA = await RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs,
  );
  console.log('Token With Integer Number Uid: ' + tokenA);
  res.status(200).send(tokenA);
});
