import React from "react";
import Breadcrumbs from "../../Common/Breadcrumbs/Breadcrumbs";


const CreateRequest = () => {
    return (
        <div>
            <Breadcrumbs secondPage={{utl: '/createRequest', name: 'Create Request'}} />
            <h3>Create Request</h3>
        </div>
    )
}

export default CreateRequest;