import styles from '../../../styles/ActivityCard.module.css'
import Badge from "./badge";
import {Image} from "@chakra-ui/react";

export default function ActivityCard({data}) {
    return (
        <div data-testid="activity-card-container" className={styles.activity__card}>
            {data && (
                <div data-testid="activity-card-thumbnail" className={styles.activity__card__top}
                     style={{backgroundImage: `url(${data.imageURL})`}}>
                </div>
            )}

            <div className={styles.activity__card__bottom}>
                <div data-testid="activity-title">Stingrays_Cypress_Activity_1</div>
                <div>
                    <div>
                        <div color="lightGray" display="inline-flex" data-testid="number-of-tagged-lo-tag">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
