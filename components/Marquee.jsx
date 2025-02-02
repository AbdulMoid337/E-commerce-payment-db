import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import { MorphingText } from "@/components/ui/morphing-text";

const reviews = [
  {
    name: "Emily Rodriguez",
    username: "@emilyr",
    body: "These wireless earbuds are a game-changer! The sound quality is incredible, and the battery life is amazing.",
    img: "https://avatar.vercel.sh/emily",
    product: "Wireless Earbuds"
  },
  {
    name: "Michael Chen",
    username: "@michaelc",
    body: "The smart fitness watch tracks everything perfectly. Absolutely love the sleek design and comprehensive health monitoring.",
    img: "https://avatar.vercel.sh/michael",
    product: "Smart Fitness Watch"
  },
  {
    name: "Sarah Thompson",
    username: "@saraht",
    body: "This laptop is a powerhouse! Perfect for both work and gaming. The graphics are stunning and it's so lightweight.",
    img: "https://avatar.vercel.sh/sarah",
    product: "High-Performance Laptop"
  },
  {
    name: "David Kim",
    username: "@davidk",
    body: "The noise-canceling headphones are incredible. They've made my work-from-home experience so much more peaceful.",
    img: "https://avatar.vercel.sh/david",
    product: "Noise-Canceling Headphones"
  },
  {
    name: "Olivia Martinez",
    username: "@oliviam",
    body: "I'm obsessed with this smartphone! The camera quality is unbelievable, and the battery lasts all day.",
    img: "https://avatar.vercel.sh/olivia",
    product: "Premium Smartphone"
  },
  {
    name: "Alex Johnson",
    username: "@alexj",
    body: "The portable bluetooth speaker is my new favorite gadget. Crystal clear sound and super durable!",
    img: "https://avatar.vercel.sh/alex",
    product: "Portable Bluetooth Speaker"
  }
];

const texts = [
    "Customer",
    "Reviews",
  ];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name, username, body, product }) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
      <p className="text-xs font-medium dark:text-white/40">{product}</p>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative flex flex-col items-center pb-16 justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
       <MorphingText texts={texts} />
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
