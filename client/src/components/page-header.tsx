import { Fragment, ReactNode } from "react";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  rightAction?: ReactNode;
  renderPageHeader?: ReactNode
}

const PageHeader = ({ title, subtitle, rightAction, renderPageHeader }: PageHeaderProps) => {
  return (
    <div className="w-full pb-14 lg:pb-24 pt-8 px-4 lg:px-0 text-white relative overflow-hidden">
      {/* Mesh Background */}
      <div className="absolute inset-0 mesh-bg opacity-40 -z-10" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-slate-950/80 -z-10" />

      <div className="w-full max-w-[var(--max-width)] mx-auto relative z-10">
        {renderPageHeader
          ? <Fragment>{renderPageHeader}</Fragment>
          : (
            <div className="w-full flex flex-col gap-4 items-start justify-start lg:items-end lg:flex-row lg:justify-between">
              {(title || subtitle) && (
                <div className="space-y-2">
                  {title && <h2 className="text-3xl lg:text-5xl font-bold tracking-tight glow-text">{title}</h2>}
                  {subtitle && <p className="text-white/50 text-base lg:text-lg font-light">{subtitle}</p>}
                </div>
              )}
              {rightAction && (
                <div className="hover:scale-105 transition-transform duration-300">
                  {rightAction}
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default PageHeader