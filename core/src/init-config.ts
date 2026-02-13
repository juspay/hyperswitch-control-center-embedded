/**
 * Theme configuration received from the merchant.
 * This is the ONLY contract we expect merchants to follow.
 */
export type MerchantTheme = {
  /** Primary color */
  primaryColor?: string;
  /** Page background color */
  backgroundColor?: string;
  /** Button configurations */
  buttons?: {
    /** Primary button configuration */
    primary?: {
      /** Primary button background color */
      backgroundColor?: string;
      /** Primary button text color */
      textColor?: string;
      /** Primary button hover background color */
      hoverBackgroundColor?: string;
    };
    /** Secondary button configuration */
    secondary?: {
      /** Secondary button background color */
      backgroundColor?: string;
      /** Secondary button text color */
      textColor?: string;
      /** Secondary button hover background color */
      hoverBackgroundColor?: string;
    };
  };
};

/**
 * Full init_config payload shape sent to the Control Center.
 * Most fields are null for now; Control Center applies defaults.
 */
export type InitConfig = {
  settings: {
    colors: {
      primary: string | null;
      secondary: string | null;
      background: string | null;
    };
    sidebar: null;
    typography: null;
    buttons: {
      primary: {
        backgroundColor: string | null;
        textColor: string | null;
        hoverBackgroundColor: string | null;
      };
     secondary: {
        backgroundColor: string | null;
        textColor: string | null;
        hoverBackgroundColor: string | null;
      };
    };
    borders: null;
    spacing: null;
  };
  urls: {
    faviconUrl: null;
    logoUrl: null;
  };
};

/**
 * Build the init_config object that Control Center expects
 * from the simple MerchantTheme contract.
 *
 * Any missing value is set to null.
 */
export function buildInitConfig(merchantTheme: MerchantTheme | undefined | null): InitConfig {
  const safeTheme = merchantTheme || {};

  return {
    settings: {
      colors: {
        primary: safeTheme.primaryColor ?? null,
        secondary: null,
        background: safeTheme.backgroundColor ?? null
      },
      sidebar: null,
      typography: null,
      buttons: {
        primary: {
          backgroundColor: safeTheme.buttons?.primary?.backgroundColor ?? null,
          textColor: safeTheme.buttons?.primary?.textColor ?? null,
          hoverBackgroundColor: safeTheme.buttons?.primary?.hoverBackgroundColor ?? null
        },
        secondary: {
          backgroundColor: safeTheme.buttons?.secondary?.backgroundColor ?? null,
          textColor: safeTheme.buttons?.secondary?.textColor ?? null,
          hoverBackgroundColor: safeTheme.buttons?.secondary?.hoverBackgroundColor ?? null
        }
      },
      borders: null,
      spacing: null
    },
    urls: {
      faviconUrl: null,
      logoUrl: null
    }
  };
}


