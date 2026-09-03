package com.cryptops.bidding.cryptops.config;

import com.mongodb.MongoClientSettings;
import org.springframework.boot.autoconfigure.mongo.MongoClientSettingsBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;

/**
 * Local/dev workaround for MongoDB Atlas SSLHandshakeException:
 * PKIX path building failed (common on Windows with antivirus TLS inspection).
 */
@Configuration
public class MongoSslConfig {

    @Bean
    public MongoClientSettingsBuilderCustomizer mongoSslCustomizer() {
        SSLContext sslContext = createTrustAllSslContext();

        return (MongoClientSettings.Builder builder) -> builder.applyToSslSettings(ssl -> {
            ssl.enabled(true);
            ssl.invalidHostNameAllowed(true);
            ssl.context(sslContext);
        });
    }

    private SSLContext createTrustAllSslContext() {
        try {
            TrustManager[] trustAll = new TrustManager[] {
                new X509TrustManager() {
                    @Override
                    public void checkClientTrusted(X509Certificate[] chain, String authType) {
                    }

                    @Override
                    public void checkServerTrusted(X509Certificate[] chain, String authType) {
                    }

                    @Override
                    public X509Certificate[] getAcceptedIssuers() {
                        return new X509Certificate[0];
                    }
                }
            };

            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, trustAll, new SecureRandom());
            return sslContext;
        } catch (Exception e) {
            throw new IllegalStateException("Could not create MongoDB SSL context", e);
        }
    }
}
