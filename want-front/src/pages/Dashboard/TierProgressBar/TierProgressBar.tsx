import { useState } from "react";
import type { ReviewsType } from "../../../store/reviews";
import "./TierProgressBar.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SvgTooltip from "@/assets/svg/tooltip.svg";

type Tier = {
  title: string;
  min: number;
  max: number | null; // null = 100+ pt
};

const tiers: Tier[] = [
  { title: "new-explorer", min: 0, max: 4 },
  {
    title: "active-contributor",
    min: 5,
    max: 19,
  },
  {
    title: "trusted-reviewer",
    min: 20,
    max: 49,
  },
  { title: "elite-guide", min: 50, max: 99 },
  {
    title: "legendary-scout",
    min: 100,
    max: null,
  },
];

type TierProgressBarProps = {
  reviews: ReviewsType;
};

const TierProgressBar = ({ reviews }: TierProgressBarProps) => {
  const { t } = useTranslation();
  const [isMsgVisible, setIsMsgVisible] = useState(false);
  const totalLikes = reviews.reduce((sum, review) => sum + review.likeCount, 0);
  const totalReviewNb = reviews.length;
  const totalScore = totalReviewNb + totalLikes;

  const stats = [
    { label: t("posts"), value: totalReviewNb },
    { label: t("likes"), value: totalLikes },
    { label: t("total-score"), value: totalScore },
  ];

  const currentTier =
    tiers.find((tier) => {
      if (tier.max === null) return totalScore >= tier.min; // return boolean. if true return matching tier (max) if false do next line
      return totalScore >= tier.min && totalScore <= tier.max;
    }) || tiers[0]; // fallback

  const nextTierIndex =
    tiers.findIndex((tier) => tier.title === currentTier.title) + 1;

  const nextTier = tiers[nextTierIndex] || null;

  const scoreUntilNextTier = nextTier.min - totalScore;

  /**
   * Progress bar calculate percentage (in actual tier)
   */
  let percent = 0;
  if (currentTier.max === null) {
    percent = 100; // last tier
  } else {
    const range = currentTier.max - currentTier.min + 1;
    const progressInTier = totalScore - currentTier.min;
    percent = (progressInTier / range) * 100;
    // Range validation
    if (percent > 100) percent = 100;
    if (percent < 0) percent = 0;
  }

  return (
    <div className="TierProgressBar">
      <p className="TierProgressBar__label">{t("you-are")}</p>
      <span className="TierProgressBar__currentTierTitle">
        {t(currentTier.title)}
      </span>
      <span
        className="TierProgressBar__tooltipIcon"
        onMouseOver={() => setIsMsgVisible(true)}
        onMouseLeave={() => setIsMsgVisible(false)}
      >
        <SvgTooltip />
        {isMsgVisible && (
          <span className="TierProgressBar__tooltipMsg">
            <ul>
              {tiers.map((tier) => (
                <li
                  key={tier.title}
                  className="TierProgressBar__tooltipMsgItem"
                >
                  <b>{t(tier.title)}</b>:{" "}
                  {tier.max === null
                    ? `${tier.min}+ pts`
                    : `${tier.min}–${tier.max} pts`}
                </li>
              ))}
            </ul>
          </span>
        )}
      </span>

      <div className="TierProgressBar__bar">
        <div
          style={{
            width: `${percent}%`,
          }}
          className="TierProgressBar__barFill"
        />
      </div>
      <p className="TierProgressBar__remain">
        You need <b>{scoreUntilNextTier}</b> more{" "}
        {scoreUntilNextTier === 1 ? "point" : "points"} to reach the{" "}
        <b>{nextTier.title}</b>. Try aiming for the top spot on the{" "}
        <Link to="/scoreboard" className="TierProgressBar__scoreBoardLink">
          scoreboard
        </Link>
        !
      </p>

      <ul className="TierProgressBar__statsContainer">
        {stats.map((item) => (
          <li key={item.label} className="TierProgressBar__statsItem">
            <p className="TierProgressBar__statsLabel">{item.label}</p>
            <p className="TierProgressBar__statValue">{item.value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TierProgressBar;
