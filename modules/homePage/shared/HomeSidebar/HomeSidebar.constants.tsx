import {
  IconArrowLeft,
  IconBrandTabler,
  IconDoor,
  IconMoneybag,
} from "@tabler/icons-react";

export const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <IconBrandTabler className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: "Classrooms",
    href: "/dashboard/classrooms",
    icon: (
      <IconDoor className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: "Expenses",
    href: "#",
    icon: (
      <IconMoneybag className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: "Logout",
    href: "#",
    icon: (
      <IconArrowLeft className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
];
