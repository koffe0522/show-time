import AccessToken, { priviledges } from './accessToken';

const Role = {
  // DEPRECATED. Role::ATTENDEE has the same privileges as Role.PUBLISHER.
  ATTENDEE: 0,

  // RECOMMENDED. Use this role for a voice/video call or a live broadcast, if your scenario does not require authentication for [Hosting-in](https://docs.agora.io/en/Agora%20Platform/terms?platform=All%20Platforms#hosting-in).
  PUBLISHER: 1,

  /* Only use this role if your scenario require authentication for [Hosting-in](https://docs.agora.io/en/Agora%20Platform/terms?platform=All%20Platforms#hosting-in).
   * @note In order for this role to take effect, please contact our support team to enable authentication for Hosting-in for you. Otherwise, Role.SUBSCRIBER still has the same privileges as Role.PUBLISHER.
   */
  SUBSCRIBER: 2,

  // DEPRECATED. Role.ADMIN has the same privileges as Role.PUBLISHER.
  ADMIN: 101,
} as const;

type valueof<T> = T[keyof T];

class RtcTokenBuilder {
  static key: AccessToken;
  static async buildTokenWithUid(
    appID: string,
    appCertificate: string,
    channelName: string,
    uid: number,
    role: valueof<typeof Role>,
    privilegeExpiredTs: number,
  ) {
    this.key = new AccessToken(appID, appCertificate, channelName, uid);
    this.key.addPriviledge(priviledges.kJoinChannel, privilegeExpiredTs);
    if (role === Role.ATTENDEE || role === Role.PUBLISHER || role === Role.ADMIN) {
      this.key.addPriviledge(priviledges.kPublishAudioStream, privilegeExpiredTs);
      this.key.addPriviledge(priviledges.kPublishVideoStream, privilegeExpiredTs);
      this.key.addPriviledge(priviledges.kPublishDataStream, privilegeExpiredTs);
    }
    return await this.key.build();
  }
}

export { RtcTokenBuilder, Role };
