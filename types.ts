export type Language = 'en' | 'ar';

export interface Translation {
  nav: {
    mission: string;
    challenge: string;
    solution: string;
    vision: string;
    partner: string;
  };
  hero: {
    badge: string;
    title_prefix: string;
    title_highlight: string;
    subtitle_prefix: string;
    subtitle_highlight: string;
    cta_primary: string;
    cta_secondary: string;
    stat_cost: string;
    stat_tech: string;
    stat_waste: string;
  };
  problem: {
    title: string;
    subtitle: string;
    chart_title: string;
    card1_title: string;
    card1_desc: string;
    card2_title: string;
    card2_desc: string;
    card3_title: string;
    card3_desc: string;
  };
  solution: {
    label: string;
    title: string;
    desc: string;
    ai_title: string;
    ai_desc: string;
    process_title: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
  };
  impact: {
    title: string;
    subtitle: string;
    simulator: {
      title: string;
      subtitle: string;
      input_label: string;
      co2_label: string;
      co2_unit: string;
      savings_label: string;
      savings_unit: string;
      disclaimer: string;
    };
    eco_title: string;
    eco_desc: string;
    env_title: string;
    env_desc: string;
  };
  vision: {
    title: string;
    desc: string;
    nidlp: string;
    sgi: string;
    pillars: {
      security: { title: string; desc: string };
      environment: { title: string; desc: string };
      economy: { title: string; desc: string };
    };
  };
  footer: {
    desc: string;
    links: string;
    contact: string;
    rights: string;
  };
}