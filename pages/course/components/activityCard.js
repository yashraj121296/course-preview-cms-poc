import styles from '../../../styles/ActivityCard.module.css'
import Badge from "./badge";

export default function ActivityCard({data}) {
    return (
        <div data-testid="activity-card-container" className={styles.activity__card}>
            <div data-testid="activity-card-thumbnail" className={styles.activity__card__top} style={{ backgroundImage: `url(${data.imageURL})` }}></div>
            <div className={styles.activity__card__bottom}>
                    <div data-testid="activity-title">Stingrays_Cypress_Activity_1</div>
                <div className="TagsSection--f5ak80 guLJfG">
                    <div className="TagWrapper--1owoezi glGVTR">
                        <div color="lightGray" display="inline-flex" data-testid="number-of-tagged-lo-tag"
                             className="sc-gvXfzc krpZAX">
                            <div className="TagContent--1bfgjr7 dwflms">
                                <Badge text={9} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
