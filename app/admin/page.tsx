import { Container } from "@/components/container"
import { Card } from "@/components/ui/card"
import { apiClient, isSuccess } from "@/lib/api-client"
import { Blog, Experience, Portfolio, TechStack } from "@/lib/schemas"
import { Briefcase, FileText, Layers, Code2 } from "lucide-react"

export default async function AdminDashboard() {
  const blogs = await apiClient.get<Blog[]>('/blogs')
  const experiences = await apiClient.get<Experience[]>('/experiences')
  const techstacks = await apiClient.get<TechStack[]>('/tech-stacks')
  const portfolios = await apiClient.get<Portfolio[]>('/portfolios')

  const stats = [
    {
      label: "Portfolio Items",
      value: isSuccess(portfolios) ? portfolios.data.length : 0,
      icon: Briefcase,
      href: "/admin/portfolio"
    },
    {
      label: "Experience",
      value: isSuccess(experiences) ? experiences.data?.length : 0,
      icon: Layers,
      href: "/admin/experience"
    },
    {
      label: "Blog Posts",
      value: isSuccess(blogs) ? blogs.data?.length : 0,
      icon: FileText,
      href: "/admin/blog"
    },
    {
      label: "Tech Stack",
      value: isSuccess(techstacks) ? techstacks.data?.length : 0,
      icon: Code2,
      href: "/admin/tech-stack"
    },
  ]

  return (
    <Container className="py-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
        <p className="text-muted-foreground mb-8">Manage your portfolio content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <a key={stat.label} href={stat.href}>
              <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <Icon className="w-12 h-12 text-primary/20" />
                </div>
              </Card>
            </a>
          )
        })}
      </div>
    </Container>
  )
}
