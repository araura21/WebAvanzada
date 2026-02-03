package com.example.calculos_polizas.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/")
    public String index() {
        return "formulario";
    }

    @GetMapping("/formulario")
    public String formulario() {
        return "formulario";
    }
}
