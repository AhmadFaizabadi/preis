export const services = {
  version: 1689434873547,
  items: [
    {
      fullName: "paintwork",
      label: "Paintwork",
      icon: "brush",
      children: [
        {
          label: "Interior wall",
          icon: "",
          fullName: "paintwork-interior wall",
        },
        {
          label: "External wall",
          icon: "",
          fullName: "paintwork-external wall",
        },
        { label: "Roof", icon: "caret-up", fullName: "paintwork-roof" },
      ],
    },
    {
      fullName: "plumbing",
      label: "Plumbing",
      icon: "shower",
      children: [
        {
          label: "Water pipe",
          icon: "",
          fullName: "plumbing-water pipe",
          children: [
            {
              label: "Onwall plumbing",
              icon: "",
              fullName: "plumbing-water pipe-onwall plumbing",
            },
            {
              label: "Conduit plumbing",
              icon: "",
              fullName: "plumbing-water pipe-conduit plumbing",
            },
          ],
        },
        {
          label: "Sewage plumbing",
          icon: "",
          fullName: "plumbing-sewage plumbing",
          children: [
            {
              label: "Toilet",
              icon: "toilet",
              fullName: "plumbing-sewage plumbing-toilet",
            },
            {
              label: "Well drilling",
              icon: "long-arrow-alt-down",
              fullName: "plumbing-sewage plumbing-well drilling",
            },
          ],
        },
      ],
    },
    {
      fullName: "electricity",
      label: "Electricity",
      icon: "bolt",
      children: [
        {
          label: "Household electricity",
          icon: "",
          fullName: "electricity-household electricity",
          children: [
            {
              label: "Wiring",
              fullName: "electricity-household electricity-wiring",
            },
            {
              label: "Installation of equipment",
              fullName:
                "electricity-household electricity-installation of equipment",
            },
            {
              label: "Repair of equipment",
              icon: "screwdriver",
              fullName: "electricity-household electricity-repair of equipment",
            },
          ],
        },
        {
          label: "Industrial electricity",
          icon: "",
          fullName: "electricity-industrial electricity",
          children: [
            {
              label: "Design and installation of electrical switchgear",
              fullName:
                "electricity-industrial electricity-Design and installation of electrical switchgear",
            },
          ],
        },
      ],
    },
  ],
};
