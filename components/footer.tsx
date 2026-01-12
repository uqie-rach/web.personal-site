import { Mail, Github, Linkedin } from "lucide-react"
import Link from "next/link"

const socialLinks = [
  { icon: Github, href: "https://github.com/uqie-rach", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/achmadfrachmadie", label: "LinkedIn" },
  { icon: Mail, href: "mailto:achmadfurqonrachmadie@gmail.com", label: "Email" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Left Section */}
          <div>
            <h3 className="font-bold text-lg mb-2">Uqie</h3>
            <p className="text-sm text-muted-foreground">Full stack developer crafting elegant digital experiences.</p>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-accent/10 transition-colors text-foreground hover:text-primary"
                  aria-label={link.label}
                >
                  <Icon size={20} />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; 2025 Uqie. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
