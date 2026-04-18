import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Mail, MessageCircle, BookOpen, Github } from "lucide-react";
import { motion } from "framer-motion";

const Support = () => {
    const supportLinks = [
        {
            title: "Documentation",
            description: "Learn how to make the most of DHR with our detailed guides.",
            icon: BookOpen,
            action: "Read Docs",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "GitHub Repository",
            description: "Contribute to the project or report technical issues.",
            icon: Github,
            action: "View Repo",
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            title: "Community Chat",
            description: "Join our Discord for real-time support and feedback.",
            icon: MessageCircle,
            action: "Join Discord",
            color: "text-green-500",
            bg: "bg-green-500/10"
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Help & Support</h3>
                <p className="text-sm text-muted-foreground">
                    Need help? Connect with us through the channels below.
                </p>
            </div>
            <Separator />

            <div className="grid gap-4">
                {supportLinks.map((link, index) => (
                    <motion.div
                        key={link.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="border-0 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-lg ${link.bg} ${link.color}`}>
                                        <link.icon className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium group-hover:text-primary transition-colors">{link.title}</h4>
                                        <p className="text-xs text-muted-foreground">{link.description}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="gap-2 text-xs">
                                    {link.action}
                                    <ExternalLink className="size-3" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Separator />

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center space-y-4">
                <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Mail className="size-6 text-primary" />
                    </div>
                </div>
                <div className="space-y-1">
                    <h4 className="font-semibold">Direct Email Support</h4>
                    <p className="text-sm text-muted-foreground">
                        For enterprise inquiries or critical account issues.
                    </p>
                </div>
                <Button className="w-full sm:w-auto px-10">
                    Contact Support
                </Button>
            </div>

            <div className="pt-4 text-center">
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest">
                    App Version 1.2.0-beta • Built with ❤️ for DHR Users
                </p>
            </div>
        </div>
    );
};

export default Support;
