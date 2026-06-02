import { useFinance } from '../../context/finance-context';
import { categoryMetaFrom } from '../../constants/categories';

/**
 * Renders a category's SVG icon inside a soft tinted chip, resolved against the
 * user's (editable) category list. `bare` renders just the glyph (no chip).
 */
export default function CategoryIcon({ category, size = 42, bare = false }) {
  const { categories } = useFinance();
  const { Icon, color } = categoryMetaFrom(categories, category);
  if (bare) return <Icon size={size} color={color} aria-hidden />;
  return (
    <span
      className="cat-icon"
      style={{ width: size, height: size, color, background: `${color}1a` }}
      aria-hidden
    >
      <Icon size={Math.round(size * 0.46)} />
    </span>
  );
}
