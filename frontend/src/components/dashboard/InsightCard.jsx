import buildInsights from "../../services/dashboard/insightBuilder";

import {
    Lightbulb,
    ShieldCheck,
    Trophy,
    Inbox,
    Users,
    PartyPopper,
    TriangleAlert
} from "lucide-react";

const cardIcons = {
    healthy: ShieldCheck,
    performer: Trophy,
    assignment: Inbox,
    team: Users
};

const bannerIcons = {
    success: PartyPopper,
    warning: TriangleAlert,
    danger: TriangleAlert,
    info: Inbox
};

export default function InsightCard({
    overview,
    engineers = [],
    teams = [],
}) {

    const insights = buildInsights({
        overview,
        engineers,
        teams
    });

    const cards = insights.filter(item => !item.banner);

    const banner = insights.find(item => item.banner);

    return (

        <div className="card">

            <div className="card-header">

                <div className="card-title">

                    <Lightbulb
                        size={18}
                        strokeWidth={2}
                    />

                    <span>
                        Ringkasan Operasional
                    </span>

                </div>

                <p className="card-description">
                    Ringkasan kondisi operasional saat ini.
                </p>

            </div>

            <div className="insight-grid">

                {cards.map(item => {

                    const Icon = cardIcons[item.id];

                    return (

                        <div
                            key={item.id}
                            className={`insight-card ${item.tone}`}
                        >

                            <div className="insight-card-icon">

                                {Icon && (
                                    <Icon
                                        size={15}
                                        strokeWidth={2}
                                    />
                                )}

                            </div>

                            <div className="insight-card-body">

                                <div className="insight-card-title">
                                    {item.title}
                                </div>

                                <div className="insight-card-value">
                                    {item.value}
                                </div>

                                <div className="insight-card-subtitle">
                                    {item.subtitle}
                                </div>

                            </div>

                        </div>

                    );

                })}

            </div>

            {banner && (() => {

                const BannerIcon = bannerIcons[banner.tone];

                return (

                    <div className={`insight-banner ${banner.tone}`}>

                        <div className="insight-banner-icon">

                            {BannerIcon && (
                                <BannerIcon
                                    size={16}
                                    strokeWidth={2}
                                />
                            )}

                        </div>

                        <div className="insight-banner-body">

                            <div className="insight-card-title">
                                {banner.title}
                            </div>

                            <div className="insight-banner-title">
                                {banner.value}
                            </div>

                            <div className="insight-banner-text">
                                {banner.subtitle}
                            </div>

                        </div>

                    </div>

                );

            })()}

        </div>

    );

}