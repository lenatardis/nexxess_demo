// Demo: the width up to which the portal frame uses its phone layout – compact header, the welcome bar
// (MobSubHeader), the left and right columns as slide-out menus. The original switched at 768px and had only
// a wide-desktop frame above it, which squeezed the content to nothing on laptops and tablets. Above this width
// the side columns narrow with the window (`--side-width` in Base.scss), so the content keeps about 560px.
// The `@media (max-width: 1280px)` queries of the frame (Home, Header, LeftBox, Navigation, RightBox, and the
// spacing under the welcome bar in Breadcrumbs and HomeContent) are this same breakpoint. The pages themselves
// keep their original 768px queries: in the phone frame on a tablet the content is as wide as on a desktop.
export const PHONE_LAYOUT_MAX_WIDTH = 1280;

export const isPhoneLayout = (width = window.innerWidth) => width <= PHONE_LAYOUT_MAX_WIDTH;
