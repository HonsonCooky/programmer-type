module.export = {
  1: {
    keybind: "y",
    comment: "yank: Copy text to clipboard",
    action: async () => {
      await navigator.clipboard.writeText(`
S8ogjPokwvJMTLr3McrT7rFM
ed5YcFGDEyZK2AFiSc8qTrNx
qAniMUFmd0l9Vyc48ZDt24Cw
RaJsXAvgXlahVGl8jPSGENpl
JMaPBX1pTtlz7YuZOIac7QAM
TKNAomMMqyLjUgxjqeFNxNfS
zEvIsRf68SCTcQdI9VMH4FuF
KXaTchijCtfmdO7IWiX7jz7S
ZvCFK8uMI2R827eiNDVqXKZv
tsNwSvR17VyQDyoZBj2q4QQU
		`);
    },
  },
  2: {
    comment: "In Neovim, copy lines 1-5 (inclusive) to your clipboard",
  },
  3: {
    keybind: "p",
    comment: "paste: Paste lines 1-5 here",
    action: async () => {
      const text = await navigator.clipboard.readText();
      return (text = `
S8ogjPokwvJMTLr3McrT7rFM
ed5YcFGDEyZK2AFiSc8qTrNx
qAniMUFmd0l9Vyc48ZDt24Cw
RaJsXAvgXlahVGl8jPSGENpl
JMaPBX1pTtlz7YuZOIac7QAM
			`);
    },
  },
};
