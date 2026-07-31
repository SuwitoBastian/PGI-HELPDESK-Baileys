export default function Brand({ collapsed }) {

    return (

        <div className="brand">

            <img
                src="/logo-helpdesk.png"
                alt="PGI Helpdesk"
                className="brand-logo"
            />

            {!collapsed && (

                <div className="brand-text">

                    <div className="brand-company">
                        PUSAT GADAI INDONESIA
                    </div>

                    <div className="brand-division">
                        IT SUPPORT HELPDESK
                    </div>

                </div>

            )}

        </div>

    );

}