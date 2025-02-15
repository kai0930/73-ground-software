import { FileQuestion, Home, Settings, SquareTerminal } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@renderer/components/ui/sidebar';
import { Link, useRouterState } from '@tanstack/react-router';
import logoWithText from '@renderer/assets/logo-with-text.svg';
import logo from '@renderer/assets/logo.svg';
import { cn } from '@renderer/lib/utils';

const items = [
  {
    groupLabel: 'Application',
    items: [
      {
        title: 'Home',
        url: '/',
        icon: Home,
      },

      {
        title: 'Commands',
        url: '/commands',
        icon: SquareTerminal,
      },
    ],
  },
  {
    groupLabel: 'Others',
    items: [
      {
        title: 'Settings',
        url: '/setting',
        icon: Settings,
      },
      {
        title: 'How to use',
        url: '/how-to-use',
        icon: FileQuestion,
      },
    ],
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const router = useRouterState();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className={cn('flex items-center pt-2', open ? 'justify-center' : 'justify-center')}>
          {open ? (
            <img src={logoWithText} alt="logo" className="aspect-[4/1] h-8 object-contain" />
          ) : (
            <img src={logo} alt="logo" className="aspect-square h-8 object-contain" />
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((itemList) => (
                <div key={itemList.groupLabel}>
                  <SidebarGroupLabel>{itemList.groupLabel}</SidebarGroupLabel>
                  {itemList.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={router.location.pathname === item.url}>
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
