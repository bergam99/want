import "./ScoreBoard.css";
import { useLoaderData } from "react-router";
import { emailFormatter } from "../../utils";
import { useTranslation } from "react-i18next";

export type ScoreType = {
  userEmail: string;
  reviewCount: number;
  totalLikes: number;
  score: number;
}[];

const ScoreBoard = () => {
  const topUsers = useLoaderData() as ScoreType;
  const { t } = useTranslation();

  return (
    <div className="ScoreBoard">
      <h2 className="ScoreBoard__title">{t("scoreboard")}</h2>
      <table className="ScoreBoard__table">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>{t("posts")}</th>
            <th>{t("likes")}</th>
            <th>{t("score")}</th>
          </tr>
        </thead>
        <tbody>
          {topUsers.map((user, i) => (
            <tr key={user.userEmail}>
              <td>{i + 1}</td>
              <td>{emailFormatter(user.userEmail)}</td>
              <td>{user.reviewCount}</td>
              <td>{user.totalLikes}</td>
              <td>{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreBoard;
