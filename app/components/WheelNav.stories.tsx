import type { Meta, StoryObj } from "@storybook/react";
import WheelNav from "./WheelNav";

const meta: Meta<typeof WheelNav> = {
  title: "Navigation/WheelNav",
  component: WheelNav,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof WheelNav>;

export const ThreeSegments: Story = {
  args: {
    segments: [
      {
        id: "1",
        label: "Life & Reflections",
        color: "#4444FF",
        slug: "life-reflections",
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        label: "Tech & AI",
        color: "#FF4444",
        slug: "tech-ai",
        created_at: new Date().toISOString(),
      },
      {
        id: "3",
        label: "Faith & Community",
        color: "#44FF44",
        slug: "faith-community",
        created_at: new Date().toISOString(),
      },
    ],
  },
};

export const FourSegments: Story = {
  args: {
    segments: [
      {
        label: "Life & Reflections",
        color: "#4444FF",
        link: "/life-reflections",
      },
      { label: "Tech & AI", color: "#FF4444", link: "/tech-ai" },
      {
        label: "Faith & Community",
        color: "#44FF44",
        link: "/faith-community",
      },
      { label: "Projects", color: "#FFFF44", link: "/projects" },
    ],
  },
};

export const LongText: Story = {
  args: {
    segments: [
      {
        id: "1",
        label: "Very Long Section Title That Might Break",
        color: "#4444FF",
        slug: "long",
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        label: "Another Really Long Title Here",
        color: "#FF4444",
        slug: "another",
        created_at: new Date().toISOString(),
      },
      {
        id: "3",
        label: "Third Extremely Long Section Name",
        color: "#44FF44",
        slug: "third",
        created_at: new Date().toISOString(),
      },
    ],
  },
};

// Add mobile viewport
LongText.parameters = {
  viewport: {
    defaultViewport: "mobile1",
  },
};
