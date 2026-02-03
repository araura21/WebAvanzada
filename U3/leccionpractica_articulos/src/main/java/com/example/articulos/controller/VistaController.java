package com.example.articulos.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class VistaController {
    @GetMapping("/")
    public String home() {
        return "index";
    }
    // ...existing code...
}