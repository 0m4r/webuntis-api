import { InternalWebuntisSecretLogin } from './base';

export class WebUntisAnonymousAuth extends InternalWebuntisSecretLogin {
    /**
     * Default OTP used by some WebUntis servers for anonymous access.
     * Kept as a constant for backward compatibility but can be overridden
     * via the constructor `otp` parameter if a different value is required.
     */
    static readonly DEFAULT_OTP = 100170;

    private anonymousOtp: number;

    /**
     *
     * @param {string} school
     * @param {string} baseurl
     * @param {string} [identity='Awesome']
     * @param {boolean} [disableUserAgent=false] If this is true, axios will not send a custom User-Agent
     * @param {number} [otp] Optional OTP to use for anonymous login. If omitted, `DEFAULT_OTP` is used.
     */
    constructor(school: string, baseurl: string, identity = 'Awesome', disableUserAgent = false, otp?: number) {
        // Use empty strings for username/password for anonymous login.
        super(school, '', '', baseurl, identity, disableUserAgent);
        this.username = '#anonymous#';
        this.anonymous = true;
        this.anonymousOtp = typeof otp === 'number' ? otp : WebUntisAnonymousAuth.DEFAULT_OTP;
    }

    override async login() {
        // Check whether the school has public access or not
        const url = `/WebUntis/jsonrpc_intern.do`;

        const requestUrl = `${this.baseurl}${url}?m=getAppSharedSecret&school=${encodeURIComponent(this.school)}&v=i3.5`;
        const requestBody = {
            id: this.id,
            method: 'getAppSharedSecret',
            params: [
                {
                    userName: '#anonymous#',
                    password: '',
                },
            ],
            jsonrpc: '2.0',
        };

        const response = await this._fetch(requestUrl, {
            method: 'POST',

            body: requestBody,
        });

        if (response.error) throw new Error('Failed to login. ' + (response.error.message || ''));

        // Use configured OTP; default kept for compatibility with servers that expect it.
        const otp = this.anonymousOtp;
        const time = new Date().getTime();
        return await this._otpLogin(otp, this.username, time, true);
    }
}
