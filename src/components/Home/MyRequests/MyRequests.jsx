import React from "react";
import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";


const MyRequests = () => {
    return (
        <div>
            <Breadcrumbs secondPage={{utl: '/myRequests', name: 'My Requests'}} />
            <h3>My Requests</h3>
        </div>
    )
}

export default MyRequests;