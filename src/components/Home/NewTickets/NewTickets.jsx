import React from "react";
import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";


const NewTickets = () => {
    return (
        <div>
            <Breadcrumbs secondPage={{utl: '/newTickets', name: 'New Tickets'}} />
            <h3>New Tickets</h3>
        </div>
    )
}

export default NewTickets;