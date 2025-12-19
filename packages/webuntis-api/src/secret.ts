import { InternalWebuntisSecretLogin } from "./base";
import type { authenticator } from "otplib";

export type Authenticator = typeof authenticator;

export class WebUntisSecretAuth extends InternalWebuntisSecretLogin {
  private readonly secret: string;
  private authenticator?: Authenticator;

  /**
   * @augments WebUntis
   * @param {string} school The school identifier
   * @param {string} user
   * @param {string} secret
   * @param {string} baseurl Just the host name of your WebUntis (Example: [school].webuntis.com)
   * @param {string} [identity="Awesome"] A identity like: MyAwesomeApp
   * @param {Object} authenticator Custom otplib v12 instance. Default will use the default otplib configuration.
   * @param {boolean} [disableUserAgent=false] If this is true, axios will not send a custom User-Agent
   */
  constructor(
    school: string,
    user: string,
    secret: string,
    baseurl: string,
    identity = "Awesome",
    authenticator: Authenticator,
    disableUserAgent = false,
  ) {
    super(school, user, null as unknown as string, baseurl, identity, disableUserAgent);
    this.secret = secret;
    this.authenticator = authenticator;
    if (!authenticator) {
      // Try to load synchronously if `require` is available (CJS).
      // Otherwise defer loading to `login()` via dynamic import.
      try {
        if (typeof (globalThis as any).require === "function") {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const otplib = (globalThis as any).require("otplib");
          this.authenticator = otplib.authenticator;
        }
      } catch (error) {
        // ignore synchronous require failure; we'll attempt dynamic import during login
        // eslint-disable-next-line no-console
        console.warn("Could not require otplib synchronously; will try dynamic import at login:", error);
      }
    }
  }

  // @ts-ignore
  async login() {
    // Get JSESSION
    if (!this.authenticator) {
      // Try dynamic import in ESM contexts
      try {
        const mod = await import("otplib");
        this.authenticator = (mod as any).authenticator;
      } catch (e) {
        throw new Error("otplib is required for secret auth but could not be loaded.");
      }
    }
    const token = this.authenticator!.generate(this.secret);
    const time = new Date().getTime();
    if (this.username == null) throw new Error("No username provided for login.");
    return await this._otpLogin(token, this.username, time);
  }
}
