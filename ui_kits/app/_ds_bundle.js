/* @ds-bundle: {"format":3,"namespace":"ManDesignSystem_005292","components":[{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Select","sourcePath":"components/core/Select.jsx"},{"name":"Tabs","sourcePath":"components/core/Tabs.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Textarea","sourcePath":"components/core/Textarea.jsx"},{"name":"RecipeCard","sourcePath":"components/recipe/RecipeCard.jsx"}],"sourceHashes":{"components/brand/Logo.jsx":"7dd85b9491da","components/core/Badge.jsx":"13d050f9955b","components/core/Button.jsx":"298370c3d3cb","components/core/Card.jsx":"8b9b694f52dd","components/core/IconButton.jsx":"93092d1c3194","components/core/Input.jsx":"165581c39388","components/core/Select.jsx":"fc399c0d27bc","components/core/Tabs.jsx":"effba5de3bba","components/core/Tag.jsx":"efc6815a4e49","components/core/Textarea.jsx":"bd2b09fb0948","components/recipe/RecipeCard.jsx":"faff2b533dc2","ui_kits/app/AIScreen.jsx":"01c109d96b36","ui_kits/app/CookingModeScreen.jsx":"64d6f0c61e23","ui_kits/app/Navbar.jsx":"d85e117874ee","ui_kits/app/RecipeDetailScreen.jsx":"0fbbd6a4607c","ui_kits/app/RecipesScreen.jsx":"646e3ca26cd5","ui_kits/app/ShoppingListScreen.jsx":"4f618f109c5d","ui_kits/app/WeeklyMenuScreen.jsx":"87409ab2afe0","ui_kits/app/data.jsx":"ca32ec3c3375","ui_kits/app/icons.jsx":"de6fe4bab0bc"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ManDesignSystem_005292 = window.ManDesignSystem_005292 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Logo.jsx
try { (() => {
/**
 * Maná brand mark — a sprout glyph (Lucide "sprout") + the "Maná" wordmark
 * in the display serif. The sprout nods to the original product's 🌿 identity.
 */
function Sprout({
  size = 22,
  color = 'currentColor'
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 20h10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 20c5.5-2.5.8-6.4 3-10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"
  }));
}
function Logo({
  variant = 'full',
  size = 'md',
  tone = 'brand',
  style = {}
}) {
  const sizes = {
    sm: {
      mark: 30,
      font: 20,
      gap: 8
    },
    md: {
      mark: 38,
      font: 26,
      gap: 10
    },
    lg: {
      mark: 52,
      font: 38,
      gap: 13
    }
  };
  const s = sizes[size] || sizes.md;
  const tones = {
    brand: {
      markBg: 'var(--primary)',
      markFg: '#fff',
      word: 'var(--text-strong)'
    },
    inverse: {
      markBg: 'rgba(255,255,255,0.16)',
      markFg: '#fff',
      word: '#fff'
    },
    mono: {
      markBg: 'var(--neutral-900)',
      markFg: '#fff',
      word: 'var(--text-strong)'
    }
  };
  const t = tones[tone] || tones.brand;
  const mark = /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: s.mark,
      height: s.mark,
      borderRadius: 'var(--radius-md)',
      background: t.markBg,
      color: t.markFg,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Sprout, {
    size: s.mark * 0.58
  }));
  if (variant === 'mark') return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      ...style
    }
  }, mark);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: s.gap,
      ...style
    }
  }, mark, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: s.font,
      fontWeight: 600,
      color: t.word,
      letterSpacing: '-0.01em',
      lineHeight: 1
    }
  }, "Man\xE1"));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Maná Badge — small status / category pill. Soft tinted background.
 */
function Badge({
  children,
  tone = 'neutral',
  size = 'md',
  style = {},
  ...rest
}) {
  const tones = {
    neutral: {
      bg: 'var(--surface-sunken)',
      fg: 'var(--text-muted)'
    },
    primary: {
      bg: 'var(--primary-soft)',
      fg: 'var(--primary-soft-fg)'
    },
    sage: {
      bg: 'var(--accent-soft)',
      fg: 'var(--accent-soft-fg)'
    },
    success: {
      bg: 'var(--success-soft)',
      fg: 'var(--success-fg)'
    },
    warning: {
      bg: 'var(--warning-soft)',
      fg: 'var(--warning-fg)'
    },
    danger: {
      bg: 'var(--danger-soft)',
      fg: 'var(--danger-fg)'
    },
    info: {
      bg: 'var(--info-soft)',
      fg: 'var(--info-fg)'
    }
  };
  const t = tones[tone] || tones.neutral;
  const sizes = {
    sm: {
      fontSize: 'var(--text-2xs)',
      padding: '2px 8px'
    },
    md: {
      fontSize: 'var(--text-xs)',
      padding: '3px 10px'
    }
  };
  const s = sizes[size] || sizes.md;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: s.fontSize,
      letterSpacing: '0.01em',
      padding: s.padding,
      borderRadius: 'var(--radius-full)',
      background: t.bg,
      color: t.fg,
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Maná Button — primary call-to-action and secondary controls.
 * Variants: primary (terracotta), secondary (outlined), ghost, sage, danger.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const sizes = {
    sm: {
      padding: '0 12px',
      height: 34,
      fontSize: 'var(--text-sm)',
      gap: 6,
      radius: 'var(--radius-sm)'
    },
    md: {
      padding: '0 18px',
      height: 42,
      fontSize: 'var(--text-base)',
      gap: 8,
      radius: 'var(--radius-md)'
    },
    lg: {
      padding: '0 26px',
      height: 52,
      fontSize: 'var(--text-md)',
      gap: 10,
      radius: 'var(--radius-md)'
    }
  };
  const s = sizes[size] || sizes.md;
  const palettes = {
    primary: {
      bg: 'var(--primary)',
      bgHover: 'var(--primary-hover)',
      bgActive: 'var(--primary-active)',
      fg: 'var(--primary-fg)',
      border: 'transparent'
    },
    sage: {
      bg: 'var(--accent)',
      bgHover: 'var(--accent-hover)',
      bgActive: 'var(--sage-700)',
      fg: 'var(--accent-fg)',
      border: 'transparent'
    },
    secondary: {
      bg: 'var(--surface-card)',
      bgHover: 'var(--surface-sunken)',
      bgActive: 'var(--neutral-200)',
      fg: 'var(--text-strong)',
      border: 'var(--border-default)'
    },
    ghost: {
      bg: 'transparent',
      bgHover: 'var(--surface-sunken)',
      bgActive: 'var(--neutral-200)',
      fg: 'var(--text-body)',
      border: 'transparent'
    },
    danger: {
      bg: 'var(--danger)',
      bgHover: 'var(--red-700)',
      bgActive: 'var(--red-700)',
      fg: '#fff',
      border: 'transparent'
    }
  };
  const p = palettes[variant] || palettes.primary;
  const bg = disabled ? 'var(--neutral-200)' : active ? p.bgActive : hover ? p.bgHover : p.bg;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      width: fullWidth ? '100%' : 'auto',
      height: s.height,
      padding: s.padding,
      fontFamily: 'var(--font-sans)',
      fontSize: s.fontSize,
      fontWeight: 'var(--fw-semibold)',
      lineHeight: 1,
      color: disabled ? 'var(--text-subtle)' : p.fg,
      background: bg,
      border: `1px solid ${disabled ? 'var(--border-subtle)' : p.border}`,
      borderRadius: s.radius,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)',
      transform: active && !disabled ? 'scale(0.98)' : 'scale(1)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flexShrink: 0
    }
  }, iconLeft), children, iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flexShrink: 0
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Maná Card — soft surface container. The foundational layout primitive.
 */
function Card({
  children,
  padding = 'md',
  interactive = false,
  elevation = 'sm',
  style = {},
  onClick,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const pads = {
    none: 0,
    sm: 'var(--space-4)',
    md: 'var(--space-5)',
    lg: 'var(--space-6)'
  };
  const shadows = {
    none: 'none',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)'
  };
  const baseShadow = shadows[elevation] || shadows.sm;
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: pads[padding] ?? pads.md,
      boxShadow: interactive && hover ? 'var(--shadow-md)' : baseShadow,
      cursor: interactive ? 'pointer' : 'default',
      transform: interactive && hover ? 'translateY(-2px)' : 'translateY(0)',
      transition: 'box-shadow var(--dur-normal) var(--ease-standard), transform var(--dur-normal) var(--ease-standard)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Maná IconButton — square/circular icon-only control.
 */
function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  shape = 'rounded',
  onClick,
  disabled = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const sizes = {
    sm: 32,
    md: 40,
    lg: 48
  };
  const dim = sizes[size] || sizes.md;
  const palettes = {
    ghost: {
      bg: 'transparent',
      bgHover: 'var(--surface-sunken)',
      fg: 'var(--text-body)',
      border: 'transparent'
    },
    secondary: {
      bg: 'var(--surface-card)',
      bgHover: 'var(--surface-sunken)',
      fg: 'var(--text-body)',
      border: 'var(--border-default)'
    },
    primary: {
      bg: 'var(--primary)',
      bgHover: 'var(--primary-hover)',
      fg: 'var(--primary-fg)',
      border: 'transparent'
    }
  };
  const p = palettes[variant] || palettes.ghost;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dim,
      height: dim,
      color: disabled ? 'var(--text-subtle)' : p.fg,
      background: disabled ? 'transparent' : hover ? p.bgHover : p.bg,
      border: `1px solid ${p.border}`,
      borderRadius: shape === 'circle' ? 'var(--radius-full)' : 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background var(--dur-fast) var(--ease-standard)',
      flexShrink: 0,
      ...style
    }
  }, rest), icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Maná Input — text field with optional label, leading icon and hint/error.
 */
function Input({
  label = null,
  hint = null,
  error = null,
  iconLeft = null,
  id,
  style = {},
  containerStyle = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? `mana-inp-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const borderColor = error ? 'var(--danger)' : focus ? 'var(--primary)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 12,
      display: 'inline-flex',
      color: 'var(--text-subtle)',
      pointerEvents: 'none'
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      height: 42,
      padding: iconLeft ? '0 14px 0 38px' : '0 14px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-strong)',
      background: 'var(--surface-card)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      boxShadow: focus ? 'var(--shadow-focus)' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, rest))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--danger)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Maná Select — native select styled to match Input, with a chevron.
 */
function Select({
  label = null,
  hint = null,
  children,
  id,
  style = {},
  containerStyle = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const selId = id || (label ? `mana-sel-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selId,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selId,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      height: 42,
      padding: '0 38px 0 14px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-strong)',
      background: 'var(--surface-card)',
      border: `1px solid ${focus ? 'var(--primary)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      boxShadow: focus ? 'var(--shadow-focus)' : 'none',
      appearance: 'none',
      WebkitAppearance: 'none',
      cursor: 'pointer',
      transition: 'border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, rest), children), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 14,
      pointerEvents: 'none',
      color: 'var(--text-muted)',
      fontSize: 12
    }
  }, "\u25BE")), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Select.jsx", error: String((e && e.message) || e) }); }

// components/core/Tabs.jsx
try { (() => {
/**
 * Maná Tabs — segmented pill tab bar. Controlled via value/onChange.
 * tabs: [{ value, label, icon? }]
 */
function Tabs({
  tabs = [],
  value,
  onChange,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'inline-flex',
      gap: 4,
      padding: 4,
      background: 'var(--surface-sunken)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      ...style
    }
  }, tabs.map(t => {
    const active = t.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: t.value,
      role: "tab",
      "aria-selected": active,
      onClick: () => onChange && onChange(t.value),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '8px 16px',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: active ? 'var(--text-strong)' : 'var(--text-muted)',
        background: active ? 'var(--surface-card)' : 'transparent',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        boxShadow: active ? 'var(--shadow-xs)' : 'none',
        cursor: 'pointer',
        transition: 'all var(--dur-fast) var(--ease-standard)',
        whiteSpace: 'nowrap'
      }
    }, t.icon && /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex'
      }
    }, t.icon), t.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Maná Tag — removable / selectable chip for categories & ingredients.
 */
function Tag({
  children,
  selected = false,
  onRemove = null,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const interactive = !!onClick;
  return /*#__PURE__*/React.createElement("span", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-medium)',
      padding: onRemove ? '5px 6px 5px 12px' : '6px 13px',
      borderRadius: 'var(--radius-full)',
      border: '1px solid',
      borderColor: selected ? 'var(--terracotta-300)' : 'var(--border-subtle)',
      background: selected ? 'var(--primary-soft)' : interactive && hover ? 'var(--surface-sunken)' : 'var(--surface-card)',
      color: selected ? 'var(--primary-soft-fg)' : 'var(--text-body)',
      cursor: interactive ? 'pointer' : 'default',
      transition: 'all var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, rest), children, onRemove && /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onRemove(e);
    },
    "aria-label": "Quitar",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 18,
      height: 18,
      borderRadius: 'var(--radius-full)',
      border: 'none',
      background: 'var(--neutral-200)',
      color: 'var(--text-muted)',
      cursor: 'pointer',
      fontSize: 13,
      lineHeight: 1,
      padding: 0
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/core/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Maná Textarea — multi-line field matching Input styling.
 */
function Textarea({
  label = null,
  hint = null,
  error = null,
  id,
  rows = 4,
  style = {},
  containerStyle = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const taId = id || (label ? `mana-ta-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const borderColor = error ? 'var(--danger)' : focus ? 'var(--primary)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: taId,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("textarea", _extends({
    id: taId,
    rows: rows,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      padding: '11px 14px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-normal)',
      color: 'var(--text-strong)',
      background: 'var(--surface-card)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      resize: 'vertical',
      boxShadow: focus ? 'var(--shadow-focus)' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, rest)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--danger)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/recipe/RecipeCard.jsx
try { (() => {
const MEAL_LABELS = {
  comida: 'Comida',
  cena: 'Cena',
  desayuno: 'Desayuno'
};
const MEAL_TONES = {
  comida: 'primary',
  cena: 'info',
  desayuno: 'warning'
};

/**
 * Maná RecipeCard — the signature recipe tile. Optional photo, meal badge,
 * time & servings meta, category tags, and ingredient preview.
 */
function RecipeCard({
  name = 'Receta',
  mealType = 'comida',
  prepTime = null,
  servings = null,
  categories = [],
  ingredients = [],
  imageUrl = null,
  onClick,
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      transform: hover ? 'translateY(-3px)' : 'translateY(0)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'box-shadow var(--dur-normal) var(--ease-standard), transform var(--dur-normal) var(--ease-standard)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 150,
      background: imageUrl ? `center/cover no-repeat url("${imageUrl}")` : 'linear-gradient(135deg, var(--terracotta-100), var(--terracotta-50))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, !imageUrl && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      fontWeight: 600,
      color: 'var(--terracotta-300)'
    }
  }, name.slice(0, 1).toUpperCase()), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 12,
      left: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: MEAL_TONES[mealType] || 'neutral'
  }, MEAL_LABELS[mealType] || mealType))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-strong)',
      lineHeight: 'var(--leading-snug)',
      margin: 0
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, prepTime != null && /*#__PURE__*/React.createElement("span", null, prepTime, " min"), servings != null && /*#__PURE__*/React.createElement("span", null, servings, " porciones")), categories.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, categories.slice(0, 3).map(c => /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    key: c,
    tone: "sage",
    size: "sm"
  }, c))), ingredients.length > 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-subtle)',
      margin: 0,
      lineHeight: 'var(--leading-normal)'
    }
  }, ingredients.slice(0, 3).join(', '), ingredients.length > 3 ? ` +${ingredients.length - 3} más` : '')));
}
Object.assign(__ds_scope, { RecipeCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/recipe/RecipeCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AIScreen.jsx
try { (() => {
/* Maná UI kit — Asistente de IA screen. */
(function () {
  const {
    Tabs,
    Textarea,
    Input,
    Select,
    Button,
    Badge,
    Card
  } = window.ManDesignSystem_005292;
  const I = window.ManaIcons;
  const SAMPLE = {
    name: 'Salteado de garbanzos al pimentón',
    prepTime: 25,
    servings: 3,
    ingredients: ['garbanzos cocidos', 'pimiento rojo', 'ajo', 'pimentón ahumado', 'espinacas', 'aceite de oliva'],
    steps: ['Dora el ajo laminado en aceite de oliva a fuego medio.', 'Añade el pimiento en tiras y saltea 5 minutos.', 'Incorpora los garbanzos y el pimentón, removiendo 3 minutos.', 'Agrega las espinacas hasta que se ablanden. Sirve caliente.']
  };
  function RecipePreview({
    recipe
  }) {
    return /*#__PURE__*/React.createElement(Card, {
      padding: "lg",
      style: {
        background: 'var(--surface-warm)',
        border: '1px solid var(--terracotta-100)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "success"
    }, /*#__PURE__*/React.createElement(I.Check, {
      size: 12
    }), " Generada")), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-xl)',
        fontWeight: 600,
        marginBottom: 4
      }
    }, recipe.name), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginBottom: 16
      }
    }, recipe.prepTime, " min \xB7 ", recipe.servings, " porciones"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1.4fr',
        gap: 24
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "mana-eyebrow",
      style: {
        marginBottom: 8
      }
    }, "Ingredientes"), /*#__PURE__*/React.createElement("ul", {
      style: {
        margin: 0,
        paddingLeft: 18,
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)',
        lineHeight: 1.9
      }
    }, recipe.ingredients.map(i => /*#__PURE__*/React.createElement("li", {
      key: i
    }, i)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "mana-eyebrow",
      style: {
        marginBottom: 8
      }
    }, "Preparaci\xF3n"), /*#__PURE__*/React.createElement("ol", {
      style: {
        margin: 0,
        paddingLeft: 18,
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)',
        lineHeight: 1.7
      }
    }, recipe.steps.map((s, i) => /*#__PURE__*/React.createElement("li", {
      key: i,
      style: {
        marginBottom: 6
      }
    }, s))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        marginTop: 20
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      iconLeft: /*#__PURE__*/React.createElement(I.Plus, {
        size: 16
      })
    }, "Guardar receta"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      iconLeft: /*#__PURE__*/React.createElement(I.Refresh, {
        size: 16
      })
    }, "Regenerar")));
  }
  function AIScreen() {
    const [tab, setTab] = React.useState('receta');
    const [ings, setIngs] = React.useState('garbanzos\npimiento rojo\nespinacas\najo');
    const [result, setResult] = React.useState(null);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 'var(--container-md)',
        margin: '0 auto',
        padding: '32px 24px 64px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "mana-eyebrow",
      style: {
        marginBottom: 8
      }
    }, "Inteligencia artificial"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-2xl)',
        fontWeight: 600,
        marginBottom: 6
      }
    }, "Asistente de cocina"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-base)',
        color: 'var(--text-muted)',
        marginBottom: 24,
        maxWidth: 520
      }
    }, "Genera recetas a partir de lo que tienes, crea variaciones y deja que la IA proponga tu men\xFA de la semana."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 28
      }
    }, /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: t => {
        setTab(t);
        setResult(null);
      },
      tabs: [{
        value: 'receta',
        label: 'Receta nueva',
        icon: /*#__PURE__*/React.createElement(I.Sparkles, {
          size: 14
        })
      }, {
        value: 'variacion',
        label: 'Variación',
        icon: /*#__PURE__*/React.createElement(I.ChefHat, {
          size: 14
        })
      }, {
        value: 'menu',
        label: 'Menú semanal',
        icon: /*#__PURE__*/React.createElement(I.Calendar, {
          size: 14
        })
      }, {
        value: 'foto',
        label: 'Importar foto',
        icon: /*#__PURE__*/React.createElement(I.Camera, {
          size: 14
        })
      }]
    })), tab === 'receta' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement(Textarea, {
      label: "Ingredientes disponibles (uno por l\xEDnea)",
      rows: 5,
      value: ings,
      onChange: e => setIngs(e.target.value)
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Select, {
      label: "Tipo de plato",
      defaultValue: "comida"
    }, /*#__PURE__*/React.createElement("option", {
      value: "comida"
    }, "Comida"), /*#__PURE__*/React.createElement("option", {
      value: "cena"
    }, "Cena")), /*#__PURE__*/React.createElement(Input, {
      label: "Preferencias",
      placeholder: "sin gluten, ligero, picante..."
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      iconLeft: /*#__PURE__*/React.createElement(I.Sparkles, {
        size: 16
      }),
      onClick: () => setResult(SAMPLE)
    }, "Generar receta")), result && /*#__PURE__*/React.createElement(RecipePreview, {
      recipe: result
    })), tab === 'variacion' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement(Select, {
      label: "Receta a modificar",
      defaultValue: ""
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "Selecciona una receta..."), /*#__PURE__*/React.createElement("option", null, "Lentejas estofadas con verduras"), /*#__PURE__*/React.createElement("option", null, "Salm\xF3n al horno con esp\xE1rragos")), /*#__PURE__*/React.createElement(Input, {
      label: "\xBFQu\xE9 variaci\xF3n quieres?",
      placeholder: "versi\xF3n vegana, m\xE1s ligera, sin l\xE1cteos..."
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      iconLeft: /*#__PURE__*/React.createElement(I.Sparkles, {
        size: 16
      })
    }, "Crear variaci\xF3n"))), tab === 'menu' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Preferencias",
      placeholder: "variado, ligero..."
    }), /*#__PURE__*/React.createElement(Select, {
      label: "Temporada",
      defaultValue: ""
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "Cualquiera"), /*#__PURE__*/React.createElement("option", null, "Verano"), /*#__PURE__*/React.createElement("option", null, "Invierno")), /*#__PURE__*/React.createElement(Select, {
      label: "Presupuesto",
      defaultValue: ""
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "Sin l\xEDmite"), /*#__PURE__*/React.createElement("option", null, "Bajo"), /*#__PURE__*/React.createElement("option", null, "Medio"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      iconLeft: /*#__PURE__*/React.createElement(I.Sparkles, {
        size: 16
      })
    }, "Sugerir men\xFA semanal"))), tab === 'foto' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)'
      }
    }, "Sube la foto de una receta escrita, un libro de cocina o una captura. La IA extraer\xE1 los datos autom\xE1ticamente."), /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1.5px dashed var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: 40,
        textAlign: 'center',
        background: 'var(--surface-card)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(I.Camera, {
      size: 36,
      color: "var(--text-subtle)",
      style: {
        marginBottom: 12
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        marginBottom: 4
      }
    }, "Haz clic para seleccionar una imagen"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-subtle)'
      }
    }, "JPG, PNG, WEBP \u2014 m\xE1x. 10 MB"))));
  }
  window.ManaAIScreen = AIScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AIScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/CookingModeScreen.jsx
try { (() => {
/* Maná UI kit — Modo cocina (step-by-step cooking) screen. Full-bleed, no navbar. */
(function () {
  const {
    Button,
    Badge
  } = window.ManDesignSystem_005292;
  const I = window.ManaIcons;
  function CookingModeScreen({
    recipe,
    onExit
  }) {
    const steps = recipe.steps;
    const [step, setStep] = React.useState(0);
    const total = steps.length;
    const pct = (step + 1) / total * 100;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: '100vh',
        background: 'var(--bg-canvas)',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 880,
        width: '100%',
        margin: '0 auto',
        padding: '20px 24px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        paddingBottom: 16,
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(I.Left, {
        size: 16
      }),
      onClick: onExit
    }, "Salir"), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-md)',
        fontWeight: 600,
        color: 'var(--text-strong)'
      }
    }, recipe.name), /*#__PURE__*/React.createElement("div", {
      className: "mana-eyebrow"
    }, "Modo cocina")), /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, step + 1, " / ", total)), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 6,
        background: 'var(--neutral-200)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        margin: '20px 0 28px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        width: pct + '%',
        background: 'var(--primary)',
        borderRadius: 'var(--radius-full)',
        transition: 'width var(--dur-slow) var(--ease-out)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 260,
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 32px',
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 52,
        height: 52,
        borderRadius: 'var(--radius-full)',
        background: 'var(--primary)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 22,
        marginBottom: 24
      }
    }, step + 1), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(20px, 3vw, 28px)',
        lineHeight: 1.5,
        color: 'var(--text-strong)',
        maxWidth: 580,
        fontWeight: 400
      }
    }, steps[step])), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "lg",
      iconLeft: /*#__PURE__*/React.createElement(I.Left, {
        size: 18
      }),
      disabled: step === 0,
      onClick: () => setStep(s => Math.max(0, s - 1))
    }, "Anterior"), step === total - 1 ? /*#__PURE__*/React.createElement(Button, {
      variant: "sage",
      size: "lg",
      iconLeft: /*#__PURE__*/React.createElement(I.Check, {
        size: 18
      }),
      onClick: onExit
    }, "Finalizar") : /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "lg",
      iconRight: /*#__PURE__*/React.createElement(I.Right, {
        size: 18
      }),
      onClick: () => setStep(s => Math.min(total - 1, s + 1))
    }, "Siguiente")), /*#__PURE__*/React.createElement("div", {
      className: "mana-eyebrow",
      style: {
        marginBottom: 10
      }
    }, "Todos los pasos"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, steps.map((s, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => setStep(i),
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        textAlign: 'left',
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        cursor: 'pointer',
        background: i === step ? 'var(--primary-soft)' : 'transparent',
        opacity: i < step ? 0.55 : 1,
        transition: 'all var(--dur-fast) var(--ease-standard)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        width: 24,
        height: 24,
        borderRadius: 'var(--radius-full)',
        background: i <= step ? 'var(--primary)' : 'var(--neutral-200)',
        color: i <= step ? '#fff' : 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 600
      }
    }, i < step ? /*#__PURE__*/React.createElement(I.Check, {
      size: 13
    }) : i + 1), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)',
        lineHeight: 1.5,
        paddingTop: 2
      }
    }, s))))));
  }
  window.ManaCookingModeScreen = CookingModeScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/CookingModeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Navbar.jsx
try { (() => {
/* Maná UI kit — top navigation bar. */
(function () {
  const {
    Logo,
    IconButton
  } = window.ManDesignSystem_005292;
  const I = window.ManaIcons;
  const LINKS = [{
    key: 'recetas',
    label: 'Recetas'
  }, {
    key: 'menu',
    label: 'Menú semanal'
  }, {
    key: 'compra',
    label: 'Lista de compras'
  }, {
    key: 'ia',
    label: 'IA',
    icon: I.Sparkles
  }];
  function Navbar({
    active,
    onNavigate
  }) {
    return /*#__PURE__*/React.createElement("nav", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        height: 'var(--navbar-height)',
        padding: '0 24px',
        background: 'var(--surface-card)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onNavigate('recetas'),
      style: {
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      size: "sm"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4,
        alignItems: 'center'
      }
    }, LINKS.map(l => {
      const on = l.key === active;
      const Icon = l.icon;
      return /*#__PURE__*/React.createElement("button", {
        key: l.key,
        onClick: () => onNavigate(l.key),
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 14px',
          borderRadius: 'var(--radius-md)',
          border: 'none',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-sm)',
          fontWeight: on ? 'var(--fw-semibold)' : 'var(--fw-medium)',
          color: on ? 'var(--primary-soft-fg)' : 'var(--text-muted)',
          background: on ? 'var(--primary-soft)' : 'transparent',
          cursor: 'pointer',
          transition: 'all var(--dur-fast) var(--ease-standard)'
        }
      }, Icon && /*#__PURE__*/React.createElement(Icon, {
        size: 15
      }), l.label);
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      icon: /*#__PURE__*/React.createElement(I.Search, {
        size: 18
      }),
      label: "Buscar",
      variant: "ghost"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 'var(--radius-full)',
        background: 'var(--sage-100)',
        color: 'var(--sage-700)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--fw-semibold)',
        fontSize: 14
      }
    }, "A")));
  }
  window.ManaNavbar = Navbar;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Navbar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/RecipeDetailScreen.jsx
try { (() => {
/* Maná UI kit — Detalle de receta screen. */
(function () {
  const {
    Button,
    Badge,
    Tag,
    IconButton,
    Card
  } = window.ManDesignSystem_005292;
  const I = window.ManaIcons;
  function RecipeDetailScreen({
    recipe,
    onBack,
    onCook
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 'var(--container-md)',
        margin: '0 auto',
        padding: '24px 24px 64px'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(I.Left, {
        size: 16
      }),
      onClick: onBack,
      style: {
        marginBottom: 18
      }
    }, "Volver a recetas"), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 220,
        borderRadius: 'var(--radius-xl)',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--terracotta-200), var(--terracotta-50))',
        display: 'flex',
        alignItems: 'flex-end',
        padding: 24
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 16,
        left: 16
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: recipe.mealType === 'comida' ? 'primary' : 'info'
    }, recipe.mealType === 'comida' ? 'Comida' : 'Cena')), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 16,
        right: 16,
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      icon: /*#__PURE__*/React.createElement(I.Heart, {
        size: 18
      }),
      label: "Guardar",
      variant: "secondary",
      shape: "circle"
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: /*#__PURE__*/React.createElement(I.Share, {
        size: 18
      }),
      label: "Compartir",
      variant: "secondary",
      shape: "circle"
    })), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-3xl)',
        fontWeight: 600,
        color: 'var(--terracotta-900)',
        lineHeight: 1.1,
        maxWidth: 520
      }
    }, recipe.name)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 28,
        marginBottom: 24,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(I.Clock, {
      size: 18,
      color: "var(--text-muted)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)'
      }
    }, /*#__PURE__*/React.createElement("strong", {
      style: {
        fontWeight: 600
      }
    }, recipe.prepTime, " min"), " de preparaci\xF3n")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(I.Users, {
      size: 18,
      color: "var(--text-muted)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)'
      }
    }, /*#__PURE__*/React.createElement("strong", {
      style: {
        fontWeight: 600
      }
    }, recipe.servings), " porciones")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, recipe.categories.map(c => /*#__PURE__*/React.createElement(Badge, {
      key: c,
      tone: "sage",
      size: "sm"
    }, c)))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 28
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "lg",
      iconLeft: /*#__PURE__*/React.createElement(I.ChefHat, {
        size: 18
      }),
      onClick: onCook
    }, "Empezar a cocinar")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1.6fr',
        gap: 28,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-lg)',
        fontWeight: 600,
        marginBottom: 14
      }
    }, "Ingredientes"), /*#__PURE__*/React.createElement("ul", {
      style: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, recipe.ingredients.map(i => /*#__PURE__*/React.createElement("li", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: 'var(--terracotta-400)',
        flexShrink: 0
      }
    }), i)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-lg)',
        fontWeight: 600,
        marginBottom: 14
      }
    }, "Preparaci\xF3n"), /*#__PURE__*/React.createElement("ol", {
      style: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, recipe.steps.map((s, i) => /*#__PURE__*/React.createElement("li", {
      key: i,
      style: {
        display: 'flex',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        width: 30,
        height: 30,
        borderRadius: 'var(--radius-full)',
        background: 'var(--primary-soft)',
        color: 'var(--primary-soft-fg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 14
      }
    }, i + 1), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-base)',
        color: 'var(--text-body)',
        lineHeight: 1.6,
        paddingTop: 3
      }
    }, s)))))));
  }
  window.ManaRecipeDetailScreen = RecipeDetailScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/RecipeDetailScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/RecipesScreen.jsx
try { (() => {
/* Maná UI kit — Recetas (recipe library) screen. */
(function () {
  const {
    Button,
    Input,
    Tag,
    RecipeCard
  } = window.ManDesignSystem_005292;
  const I = window.ManaIcons;
  const FILTERS = ['Todas', 'Comida', 'Cena', 'Vegetariano', 'Rápido'];
  function RecipesScreen({
    recipes,
    onOpen
  }) {
    const [query, setQuery] = React.useState('');
    const [filter, setFilter] = React.useState('Todas');
    const list = recipes.filter(r => {
      const q = query.trim().toLowerCase();
      const matchQ = !q || r.name.toLowerCase().includes(q) || r.ingredients.some(i => i.includes(q));
      const matchF = filter === 'Todas' || filter === 'Comida' && r.mealType === 'comida' || filter === 'Cena' && r.mealType === 'cena' || r.categories.includes(filter);
      return matchQ && matchF;
    });
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 'var(--container-lg)',
        margin: '0 auto',
        padding: '32px 24px 64px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 24,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "mana-eyebrow",
      style: {
        marginBottom: 8
      }
    }, "Tu recetario"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-2xl)',
        fontWeight: 600
      }
    }, "Mis recetas")), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      iconLeft: /*#__PURE__*/React.createElement(I.Plus, {
        size: 16
      })
    }, "Nueva receta")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        marginBottom: 16,
        flexWrap: 'wrap',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Input, {
      iconLeft: /*#__PURE__*/React.createElement(I.Search, {
        size: 16
      }),
      placeholder: "Buscar recetas o ingredientes...",
      value: query,
      onChange: e => setQuery(e.target.value),
      containerStyle: {
        flex: 1,
        minWidth: 240
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginBottom: 28,
        flexWrap: 'wrap'
      }
    }, FILTERS.map(f => /*#__PURE__*/React.createElement(Tag, {
      key: f,
      selected: filter === f,
      onClick: () => setFilter(f)
    }, f))), list.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        padding: '64px 0',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-lg)',
        color: 'var(--text-body)',
        marginBottom: 6
      }
    }, "Sin resultados"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)'
      }
    }, "Prueba con otra b\xFAsqueda o filtro.")) : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 18
      }
    }, list.map(r => /*#__PURE__*/React.createElement(RecipeCard, {
      key: r.id,
      name: r.name,
      mealType: r.mealType,
      prepTime: r.prepTime,
      servings: r.servings,
      categories: r.categories,
      ingredients: r.ingredients,
      onClick: () => onOpen(r)
    }))));
  }
  window.ManaRecipesScreen = RecipesScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/RecipesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ShoppingListScreen.jsx
try { (() => {
/* Maná UI kit — Lista de compras screen. */
(function () {
  const {
    Button,
    Badge,
    Card
  } = window.ManDesignSystem_005292;
  const I = window.ManaIcons;
  const GROUPS = [{
    cat: 'Verduras y hortalizas',
    items: ['Zanahoria — 4 ud', 'Cebolla — 3 ud', 'Tomate — 6 ud', 'Espinacas — 200 g', 'Pimiento rojo — 2 ud', 'Calabaza — 1 ud']
  }, {
    cat: 'Legumbres y cereales',
    items: ['Lentejas — 500 g', 'Garbanzos — 400 g', 'Quinoa — 250 g', 'Arroz — 500 g']
  }, {
    cat: 'Pescado y carne',
    items: ['Salmón — 2 lomos', 'Pollo — 600 g']
  }, {
    cat: 'Despensa',
    items: ['Aceite de oliva', 'Pimentón ahumado', 'Laurel', 'Caldo de verduras — 1 L']
  }];
  function Row({
    label
  }) {
    const [done, setDone] = React.useState(false);
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => setDone(d => !d),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        textAlign: 'left',
        padding: '10px 4px',
        border: 'none',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'transparent',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 22,
        height: 22,
        borderRadius: 'var(--radius-sm)',
        flexShrink: 0,
        border: done ? 'none' : '1.5px solid var(--border-strong)',
        background: done ? 'var(--sage-500)' : 'transparent',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all var(--dur-fast) var(--ease-standard)'
      }
    }, done && /*#__PURE__*/React.createElement(I.Check, {
      size: 14
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-base)',
        color: done ? 'var(--text-subtle)' : 'var(--text-body)',
        textDecoration: done ? 'line-through' : 'none'
      }
    }, label));
  }
  function ShoppingListScreen() {
    const total = GROUPS.reduce((n, g) => n + g.items.length, 0);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 'var(--container-md)',
        margin: '0 auto',
        padding: '32px 24px 64px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 24,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "mana-eyebrow",
      style: {
        marginBottom: 8
      }
    }, "Generada desde tu men\xFA"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-2xl)',
        fontWeight: 600
      }
    }, "Lista de compras")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, total, " art\xEDculos"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(I.Share, {
        size: 15
      })
    }, "Compartir"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 18
      }
    }, GROUPS.map(g => /*#__PURE__*/React.createElement(Card, {
      key: g.cat,
      padding: "lg"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mana-eyebrow",
      style: {
        marginBottom: 8
      }
    }, g.cat), /*#__PURE__*/React.createElement("div", null, g.items.map(it => /*#__PURE__*/React.createElement(Row, {
      key: it,
      label: it
    })))))));
  }
  window.ManaShoppingListScreen = ShoppingListScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ShoppingListScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/WeeklyMenuScreen.jsx
try { (() => {
/* Maná UI kit — Menú semanal (weekly planner board) screen. */
(function () {
  const {
    Button,
    Badge
  } = window.ManDesignSystem_005292;
  const I = window.ManaIcons;
  function Slot({
    recipe,
    meal,
    onClear
  }) {
    const filled = !!recipe;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: 78,
        borderRadius: 'var(--radius-md)',
        padding: 10,
        border: filled ? '1px solid var(--terracotta-200)' : '1.5px dashed var(--border-default)',
        background: filled ? 'var(--surface-warm)' : 'var(--surface-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        position: 'relative',
        transition: 'all var(--dur-fast) var(--ease-standard)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "mana-eyebrow",
      style: {
        fontSize: 'var(--text-2xs)'
      }
    }, meal), filled ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--terracotta-700)',
        lineHeight: 1.3
      }
    }, recipe.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, recipe.prepTime, " min"), /*#__PURE__*/React.createElement("button", {
      onClick: onClear,
      "aria-label": "Quitar",
      style: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 20,
        height: 20,
        borderRadius: 'var(--radius-full)',
        border: 'none',
        background: 'rgba(255,255,255,0.7)',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0
      }
    }, /*#__PURE__*/React.createElement(I.X, {
      size: 12
    }))) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-subtle)',
        margin: 'auto 0'
      }
    }, "Arrastra una receta"));
  }
  function WeeklyMenuScreen({
    recipes,
    menu,
    days
  }) {
    const [board, setBoard] = React.useState(menu);
    const byId = Object.fromEntries(recipes.map(r => [r.id, r]));
    const clear = (day, meal) => setBoard(b => ({
      ...b,
      [day]: {
        ...b[day],
        [meal]: null
      }
    }));
    const assigned = Object.values(board).reduce((n, d) => n + (d.comida ? 1 : 0) + (d.cena ? 1 : 0), 0);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 'var(--container-lg)',
        margin: '0 auto',
        padding: '32px 24px 64px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 24,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "mana-eyebrow",
      style: {
        marginBottom: 8
      }
    }, "Semana del 16 de junio"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-2xl)',
        fontWeight: 600
      }
    }, "Men\xFA semanal")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      iconLeft: /*#__PURE__*/React.createElement(I.Cart, {
        size: 16
      })
    }, "Lista de compras"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      iconLeft: /*#__PURE__*/React.createElement(I.Sparkles, {
        size: 16
      })
    }, "Auto-generar"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      iconLeft: /*#__PURE__*/React.createElement(I.Share, {
        size: 16
      })
    }, "Compartir"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "sage"
    }, assigned, " de 14 comidas planificadas")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 8,
        marginBottom: 40
      }
    }, days.map((day, di) => /*#__PURE__*/React.createElement("div", {
      key: di,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-muted)',
        paddingBottom: 2
      }
    }, day), /*#__PURE__*/React.createElement(Slot, {
      recipe: byId[board[di].comida],
      meal: "Comida",
      onClear: () => clear(di, 'comida')
    }), /*#__PURE__*/React.createElement(Slot, {
      recipe: byId[board[di].cena],
      meal: "Cena",
      onClear: () => clear(di, 'cena')
    })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-lg)',
        fontWeight: 600,
        marginBottom: 4
      }
    }, "Recetas disponibles"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginBottom: 14
      }
    }, "Arrastra una receta al tablero para asignarla a un d\xEDa."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, recipes.map(r => /*#__PURE__*/React.createElement("div", {
      key: r.id,
      draggable: true,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderLeft: `3px solid ${r.mealType === 'comida' ? 'var(--terracotta-500)' : 'var(--sage-500)'}`,
        borderRadius: 'var(--radius-sm)',
        padding: '8px 12px',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)',
        cursor: 'grab',
        userSelect: 'none'
      }
    }, r.name)))));
  }
  window.ManaWeeklyMenuScreen = WeeklyMenuScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/WeeklyMenuScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.jsx
try { (() => {
/* Maná UI kit — sample data for the recreated screens. */
window.ManaData = {
  recipes: [{
    id: 1,
    name: 'Lentejas estofadas con verduras',
    mealType: 'comida',
    prepTime: 40,
    servings: 4,
    categories: ['Vegetariano', 'Saludable'],
    ingredients: ['lentejas', 'zanahoria', 'cebolla', 'tomate', 'laurel', 'pimentón'],
    steps: ['Sofríe la cebolla y la zanahoria picadas en aceite de oliva a fuego medio durante 8 minutos.', 'Añade el tomate rallado y el pimentón, y cocina 3 minutos más.', 'Incorpora las lentejas, el laurel y agua hasta cubrir. Lleva a ebullición.', 'Baja el fuego y cocina a fuego lento 30 minutos, hasta que las lentejas estén tiernas.', 'Rectifica de sal y deja reposar 5 minutos antes de servir.']
  }, {
    id: 2,
    name: 'Salmón al horno con espárragos',
    mealType: 'cena',
    prepTime: 25,
    servings: 2,
    categories: ['Pescado', 'Bajo en carbohidratos'],
    ingredients: ['salmón', 'espárragos', 'limón', 'aceite de oliva', 'eneldo'],
    steps: ['Precalienta el horno a 200°C.', 'Coloca el salmón y los espárragos en una bandeja, riega con aceite y limón.', 'Hornea 15-18 minutos.', 'Espolvorea eneldo fresco y sirve.']
  }, {
    id: 3,
    name: 'Crema de calabaza y jengibre',
    mealType: 'cena',
    prepTime: 30,
    servings: 4,
    categories: ['Vegetariano', 'Sopa'],
    ingredients: ['calabaza', 'jengibre', 'cebolla', 'caldo de verduras', 'nata'],
    steps: ['Sofríe la cebolla y el jengibre.', 'Añade la calabaza en dados y el caldo.', 'Cocina 20 minutos y tritura.', 'Termina con un toque de nata.']
  }, {
    id: 4,
    name: 'Ensalada de quinoa y aguacate',
    mealType: 'comida',
    prepTime: 20,
    servings: 2,
    categories: ['Vegano', 'Rápido'],
    ingredients: ['quinoa', 'aguacate', 'tomate cherry', 'pepino', 'lima'],
    steps: ['Cuece la quinoa 15 minutos y deja enfriar.', 'Pica las verduras.', 'Mezcla todo y aliña con lima y aceite.']
  }, {
    id: 5,
    name: 'Pollo al limón con arroz',
    mealType: 'comida',
    prepTime: 45,
    servings: 4,
    categories: ['Carne'],
    ingredients: ['pollo', 'limón', 'arroz', 'ajo', 'romero'],
    steps: ['Marina el pollo con limón, ajo y romero 15 min.', 'Dora el pollo en una sartén.', 'Cuece el arroz aparte.', 'Sirve el pollo sobre el arroz con su jugo.']
  }, {
    id: 6,
    name: 'Tortilla de patatas',
    mealType: 'cena',
    prepTime: 35,
    servings: 4,
    categories: ['Clásico', 'Vegetariano'],
    ingredients: ['patata', 'huevo', 'cebolla', 'aceite de oliva'],
    steps: ['Fríe las patatas y la cebolla a fuego lento.', 'Bate los huevos y mezcla.', 'Cuaja la tortilla por ambos lados.']
  }, {
    id: 7,
    name: 'Garbanzos con espinacas',
    mealType: 'comida',
    prepTime: 30,
    servings: 4,
    categories: ['Vegetariano', 'Saludable'],
    ingredients: ['garbanzos', 'espinacas', 'ajo', 'comino', 'tomate'],
    steps: ['Sofríe ajo y comino.', 'Añade tomate y espinacas.', 'Incorpora los garbanzos y cocina 10 min.']
  }, {
    id: 8,
    name: 'Pasta al pesto de albahaca',
    mealType: 'cena',
    prepTime: 20,
    servings: 2,
    categories: ['Rápido', 'Vegetariano'],
    ingredients: ['pasta', 'albahaca', 'piñones', 'parmesano', 'ajo'],
    steps: ['Cuece la pasta al dente.', 'Tritura albahaca, piñones, ajo y parmesano con aceite.', 'Mezcla y sirve.']
  }],
  // menu[day][meal] = recipeId
  menu: {
    0: {
      comida: 1,
      cena: 2
    },
    1: {
      comida: 4,
      cena: 3
    },
    2: {
      comida: 5,
      cena: 6
    },
    3: {
      comida: 7,
      cena: 8
    },
    4: {
      comida: 1,
      cena: null
    },
    5: {
      comida: null,
      cena: null
    },
    6: {
      comida: null,
      cena: null
    }
  },
  days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/icons.jsx
try { (() => {
/* Maná UI kit — inline Lucide icons (2px stroke, rounded) exposed on window.
   Avoids a runtime dependency while keeping crisp, on-brand iconography. */
const Ic = paths => ({
  size = 20,
  color = 'currentColor',
  style = {}
}) => React.createElement('svg', {
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: color,
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  style
}, paths.map((d, i) => React.createElement('path', {
  key: i,
  d
})));
const IcEl = els => ({
  size = 20,
  color = 'currentColor',
  style = {}
}) => React.createElement('svg', {
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: color,
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  style
}, els);
const E = React.createElement;
window.ManaIcons = {
  Search: IcEl([E('circle', {
    key: 0,
    cx: 11,
    cy: 11,
    r: 8
  }), E('path', {
    key: 1,
    d: 'm21 21-4.3-4.3'
  })]),
  Plus: Ic(['M12 5v14', 'M5 12h14']),
  Sparkles: Ic(['m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z']),
  ChefHat: Ic(['M15 11h.01M11 15h.01M16 16h.01M2 16l20 6-6-20A20 20 0 0 0 2 16', 'M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4']),
  Calendar: IcEl([E('path', {
    key: 0,
    d: 'M8 2v4M16 2v4M3 10h18'
  }), E('rect', {
    key: 1,
    width: 18,
    height: 18,
    x: 3,
    y: 4,
    rx: 2
  })]),
  Cart: IcEl([E('circle', {
    key: 0,
    cx: 8,
    cy: 21,
    r: 1
  }), E('circle', {
    key: 1,
    cx: 19,
    cy: 21,
    r: 1
  }), E('path', {
    key: 2,
    d: 'M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12'
  })]),
  Camera: IcEl([E('path', {
    key: 0,
    d: 'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z'
  }), E('circle', {
    key: 1,
    cx: 12,
    cy: 13,
    r: 3
  })]),
  Share: IcEl([E('circle', {
    key: 0,
    cx: 18,
    cy: 5,
    r: 3
  }), E('circle', {
    key: 1,
    cx: 6,
    cy: 12,
    r: 3
  }), E('circle', {
    key: 2,
    cx: 18,
    cy: 19,
    r: 3
  }), E('path', {
    key: 3,
    d: 'm8.6 13.5 6.8 4M15.4 6.5l-6.8 4'
  })]),
  Refresh: Ic(['M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8', 'M21 3v5h-5', 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16', 'M8 16H3v5']),
  Check: Ic(['M20 6 9 17l-5-5']),
  X: Ic(['M18 6 6 18M6 6l12 12']),
  Left: Ic(['m15 18-6-6 6-6']),
  Right: Ic(['m9 18 6-6-6-6']),
  Clock: IcEl([E('circle', {
    key: 0,
    cx: 12,
    cy: 12,
    r: 10
  }), E('path', {
    key: 1,
    d: 'M12 6v6l4 2'
  })]),
  Users: IcEl([E('path', {
    key: 0,
    d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'
  }), E('circle', {
    key: 1,
    cx: 9,
    cy: 7,
    r: 4
  }), E('path', {
    key: 2,
    d: 'M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75'
  })]),
  ArrowRight: Ic(['M5 12h14', 'm12 5 7 7-7 7']),
  Filter: Ic(['M3 4h18M7 12h10M11 20h2']),
  Copy: IcEl([E('rect', {
    key: 0,
    width: 14,
    height: 14,
    x: 8,
    y: 8,
    rx: 2
  }), E('path', {
    key: 1,
    d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2'
  })]),
  Heart: Ic(['M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z']),
  Trash: Ic(['M3 6h18', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'])
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/icons.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.RecipeCard = __ds_scope.RecipeCard;

})();
