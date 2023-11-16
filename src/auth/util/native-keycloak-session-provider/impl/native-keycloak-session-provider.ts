import { SessionProvider } from '../../../def/session-provider';
import { Observable } from 'rxjs';
import { ApiService, HttpRequestType, JWTUtil, Request, ApiConfig} from '../../../../api';
import { map } from 'rxjs/operators';
import { SunbirdSdk } from '../../../../sdk';
import { CsModule } from '@project-sunbird/client-services';
import { WebviewSessionProviderConfig } from '../../webview-session-provider/def/webview-session-provider-config';
import { OAuthSession } from 'src/auth/def/o-auth-session';

export interface NativeKeycloakTokens {
    username: string;
    password: string;
}

export class NativeKeycloakSessionProvider implements SessionProvider {
    private static readonly LOGIN_API_ENDPOINT = '/keycloak/login';
    private apiService: ApiService;
    protected apiConfig: ApiConfig;
    devicePlatform = "";
    private static parseAccessToken(accessToken: string): {
        userToken: string;
        accessTokenExpiresOn: number;
    } {
        const payload: { sub: string, exp: number } = JWTUtil.getJWTPayload(accessToken);
        return {
            userToken: payload.sub.split(':').length === 3 ? <string>payload.sub.split(':').pop() : payload.sub,
            accessTokenExpiresOn: payload.exp * 1000
        };
    }
    
    private loginConfig: WebviewSessionProviderConfig;
    constructor(
        private nativeKeycloakTokenProvider: () => Promise<{WebviewSessionProviderConfig, NativeKeycloakTokens}>
    ) {
        window['Capacitor']['Plugins'].Device.getInfo().then((val) => {
            this.devicePlatform = val.platform;
        })
        this.apiService = SunbirdSdk.instance.apiService;
    }

    async provide(): Promise<OAuthSession> {
        const nativeKeycloakTokenProvider = await this.nativeKeycloakTokenProvider();
        console.log("token ****** ", nativeKeycloakTokenProvider);
        let token = nativeKeycloakTokenProvider.NativeKeycloakTokens
        this.loginConfig = nativeKeycloakTokenProvider.WebviewSessionProviderConfig
        return this.callKeycloakNativeLogin(token.username, token.password).toPromise();
    }

    private callKeycloakNativeLogin(emailId: string, password: string): Observable<OAuthSession | any> {
        console.log('username, password ', emailId, password);
        const platform = this.devicePlatform.toLowerCase() ==='ios' ? 'ios' : this.devicePlatform.toLowerCase();
        const apiRequest: Request = new Request.Builder()
            .withType(HttpRequestType.POST)
            .withPath(NativeKeycloakSessionProvider.LOGIN_API_ENDPOINT)
            .withBearerToken(false)
            .withUserToken(false)
            .withBody({
                client_id: platform || 'android',
                emailId: emailId,
                password: password,
                loginConfig: this.loginConfig.target
            })
            .build();
            console.log('keycloack req ', apiRequest);
        return this.apiService.fetch<{ access_token: string, refresh_token: string }>(apiRequest)
        .pipe(
            map((success) => {
                console.log('login success ', success);
                if (success.body && success.body.access_token) {
                    CsModule.instance.updateAuthTokenConfig(success.body.access_token);
                    return {
                        access_token: success.body.access_token,
                        refresh_token: success.body.refresh_token,
                        userToken: NativeKeycloakSessionProvider.parseAccessToken(success.body.access_token).userToken
                    };
                } else {
                    return success.body;
                }
            })
        );
    }
}
