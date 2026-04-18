import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const Team = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Team Management</h3>
                    <p className="text-sm text-muted-foreground">
                        Invite and manage your team members and their permissions.
                    </p>
                </div>
                <Button size="sm" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Invite Member
                </Button>
            </div>
            <Separator />

            <div className="grid gap-4">
                <div className="p-4 border rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            JD
                        </div>
                        <div>
                            <p className="text-sm font-medium">John Doe (You)</p>
                            <p className="text-xs text-muted-foreground">john@example.com</p>
                        </div>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded-md font-medium uppercase">Owner</span>
                </div>

                <div className="rounded-lg border border-dashed p-8 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <UserPlus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                        <h4 className="font-medium">No other members</h4>
                        <p className="text-sm text-muted-foreground max-w-[200px]">
                            Invite your first team member to start collaborating.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;
