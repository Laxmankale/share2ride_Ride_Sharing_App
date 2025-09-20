package com.share2go.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
	@GetMapping("/")
	public String welcome() {
		return "Welcome to Share2Go App!";
	}
}
