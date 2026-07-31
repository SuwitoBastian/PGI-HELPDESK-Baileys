export default function DashboardSection({
    icon,
    title,
    description,
    right,
    children
}) {

    return (

        <section className="dashboard-section">

            <div className="dashboard-section-header">

                <div className="dashboard-section-header-left">

                    <div className="dashboard-section-title">

                        {icon}

                        <h2>
                            {title}
                        </h2>

                    </div>

                    {description && (
                        <p>
                            {description}
                        </p>
                    )}

                </div>

                {right && (
                    <div className="dashboard-section-header-right">
                        {right}
                    </div>
                )}

            </div>

            <div className="dashboard-section-content">
                {children}
            </div>

        </section>

    );

}