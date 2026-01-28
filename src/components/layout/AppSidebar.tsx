import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Briefcase,
  Building2,
  Database,
  AlertTriangle,
  Scale,
  Shield,
  FileText,
  BarChart3,
  FileArchive,
  AlertCircle,
  ChevronDown,
  LogOut,
  User,
  Users,
  Heart,
  DollarSign,
  Tv,
  Menu,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

const products = [
  { name: "FairHire AI", icon: Users, href: "/dashboard", active: true },
  { name: "MedParity", icon: Heart, href: "/products/medparity", comingSoon: true },
  { name: "FinParity", icon: DollarSign, href: "/products/finparity", comingSoon: true },
  { name: "ContentGuard", icon: Tv, href: "/products/contentguard", comingSoon: true },
  { name: "Enterprise", icon: Building2, href: "/products/enterprise", comingSoon: true },
];

const mainNav = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Tasks", icon: CheckSquare, href: "/tasks" },
];

const discoveryNav = [
  { name: "Use Cases", icon: Briefcase, href: "/use-cases" },
  { name: "Vendors", icon: Building2, href: "/vendors" },
  { name: "Model Inventory", icon: Database, href: "/models" },
];

const assuranceNav = [
  { name: "Risk Management", icon: AlertTriangle, href: "/risks" },
  { name: "Bias & Fairness", icon: Scale, href: "/bias-metrics" },
  { name: "Compliance", icon: Shield, href: "/compliance" },
  { name: "Evidence Hub", icon: FileArchive, href: "/evidence" },
  { name: "Reporting", icon: BarChart3, href: "/reporting" },
];

const governanceNav = [
  { name: "Policy Manager", icon: FileText, href: "/policies" },
  { name: "Incidents", icon: AlertCircle, href: "/incidents" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out successfully" });
    navigate("/");
  };

  const renderNavItem = (item: { name: string; icon: React.ElementType; href: string }) => (
    <SidebarMenuItem key={item.name}>
      <SidebarMenuButton asChild>
        <NavLink
          to={item.href}
          end={item.href === "/dashboard"}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {!collapsed && <span>{item.name}</span>}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">P</span>
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-sidebar-foreground">Parity AI</span>
          )}
        </Link>

        {!collapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="mt-4 w-full justify-between bg-sidebar-accent border-sidebar-border"
              >
                <div className="flex items-center gap-2">
                  <selectedProduct.icon className="h-4 w-4" />
                  <span className="text-sm">{selectedProduct.name}</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-popover">
              {products.map((product) => (
                <DropdownMenuItem
                  key={product.name}
                  onClick={() => {
                    if (!product.comingSoon) {
                      setSelectedProduct(product);
                      navigate(product.href);
                    }
                  }}
                  className={product.comingSoon ? "opacity-50" : ""}
                >
                  <product.icon className="mr-2 h-4 w-4" />
                  <span>{product.name}</span>
                  {product.comingSoon && (
                    <span className="ml-auto text-xs text-muted-foreground">Soon</span>
                  )}
                  {product.active && (
                    <span className="ml-auto text-xs text-success">Active</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">MAIN</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{mainNav.map(renderNavItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">DISCOVERY</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{discoveryNav.map(renderNavItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">ASSURANCE</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{assuranceNav.map(renderNavItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">GOVERNANCE</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{governanceNav.map(renderNavItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex-1 justify-start gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
                  <User className="h-4 w-4" />
                </div>
                {!collapsed && <span className="text-sm">Account</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-popover">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {!collapsed && <ThemeToggle />}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
