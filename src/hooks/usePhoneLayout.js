import {useEffect, useState} from "react";
import {PHONE_LAYOUT_MAX_WIDTH} from "../settings/layout";

// Demo: whether the frame uses its phone layout, kept up to date when the window is resized – the same media query
// as the frame's CSS. (The original read window.innerWidth once per render, so after a resize the phone menus and
// the welcome bar stayed on a desktop-wide window.)
const QUERY = `(max-width: ${PHONE_LAYOUT_MAX_WIDTH}px)`;

const usePhoneLayout = () => {
    const [isPhone, setIsPhone] = useState(() => window.matchMedia(QUERY).matches);

    useEffect(() => {
        const media = window.matchMedia(QUERY);
        const onChange = () => setIsPhone(media.matches);
        onChange();
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, []);

    return isPhone;
};

export default usePhoneLayout;
