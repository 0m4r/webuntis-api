import { WebUntisSecretAuth } from './secret';
import type { Authenticator } from './secret';
import type { URL } from 'url';

/**
 * @private
 */
export type URLClass = typeof URL;

export class WebUntisQR extends WebUntisSecretAuth {
    /**
     * Use the data you get from a WebUntis QR code
     * @param {string} QRCodeURI A WebUntis uri. This is the data you get from the QR Code from the webuntis webapp under profile->Data access->Display
     * @param {string} [identity="Awesome"]  A identity like: MyAwesomeApp
     * @param {Object} authenticator Custom otplib v12 instance. Default will use the default otplib configuration.
     * @param {Object} URL Custom whatwg url implementation. Default will use the nodejs implementation.
     * @param {boolean} [disableUserAgent=false] If this is true, axios will not send a custom User-Agent
     */
    constructor(
        QRCodeURI: string,
        identity: string,
        authenticator: Authenticator,
        URL?: URLClass,
        disableUserAgent = false,
    ) {
        let URLImplementation = URL;
        if (!URL) {
            // Prefer global URL (browsers / modern Node). Fall back to require('url') in CJS.
            if (typeof (globalThis as any).URL === 'function') {
                URLImplementation = (globalThis as any).URL as unknown as URLClass;
            } else if (typeof (globalThis as any).require === 'function') {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const urlModule = (globalThis as any).require('url');
                    URLImplementation = urlModule.URL as URLClass;
                } catch (error) {
                    throw new Error('Failed to load url module: ' + (error as Error).message);
                }
            } else {
                throw new Error('You need to provide the URL object by yourself. Could not obtain URL implementation.');
            }
        }

        if (!URLImplementation) {
            throw new Error('URL implementation is not available.');
        }
        const URLImpl = URLImplementation as URLClass;
        const uri = new URLImpl(QRCodeURI);
        super(
            uri.searchParams.get('school')!,
            uri.searchParams.get('user')!,
            uri.searchParams.get('key')!,
            uri.searchParams.get('url')!,
            identity,
            authenticator,
            disableUserAgent,
        );
    }
}
