import React from "react";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black border-t border-purple-900/30 py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-red-500 to-blue-900 bg-clip-text text-transparent mb-4">
              Contact
            </h3>
            <p className="text-gray-400 mb-4">
              Feel free to reach out for collaborations or just a friendly chat.
            </p>
            <p className="text-gray-400">
              <a
                href="mailto:contact@example.com"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                contact@example.com
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-red-500 to-blue-900 bg-clip-text text-transparent mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#projects"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#research"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Research
                </a>
              </li>
              <li>
                <a
                  href="#skills"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Skills
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  About Me
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-red-500 to-blue-900 bg-clip-text text-transparent mb-4">
              Connect
            </h3>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-gray-900 hover:bg-purple-900/50 text-gray-400 hover:text-purple-400"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-gray-900 hover:bg-purple-900/50 text-gray-400 hover:text-purple-400"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-gray-900 hover:bg-purple-900/50 text-gray-400 hover:text-purple-400"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-gray-900 hover:bg-purple-900/50 text-gray-400 hover:text-purple-400"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-purple-900/30 my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} Ayushman Malla. All rights reserved.
          </p>
          <div className="text-gray-500 text-sm">
            <span className="inline-flex items-center">
              Designed with
              <span className="mx-1 text-red-500">♥</span>
              and built with Next.js
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
