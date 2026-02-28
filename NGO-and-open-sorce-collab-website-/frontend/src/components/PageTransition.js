/**
 * Wraps children with a CSS page-enter animation.
 */
export default function PageTransition({ children }) {
  return <div className="page-enter animate-fade-in">{children}</div>;
}
