package com.example.calculos_polizas.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Cálculo de Pólizas de Seguro")
                        .description("API REST para calcular y gestionar pólizas de seguro vehicular. " +
                                "Permite crear, consultar, buscar y eliminar pólizas.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Soporte Técnico")
                                .email("soporte@seguros.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:9090")
                                .description("Servidor de Desarrollo")
                ));
    }
}
