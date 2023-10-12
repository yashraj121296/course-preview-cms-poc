import {Flex} from '@chakra-ui/react'
import styles from '../../../styles/Badge.module.css'
export default function Badge({text = 'lorem ipsum'}) {
    return (
        <Flex className={styles.badge}>
            <div className={styles.badgeContainer}>
                <svg color="rgb(72, 84, 101)" fill="currentColor" width="12px" height="1em" viewBox="0 0 200 200"
                     data-testid="activity-count-book-icon" className="sc-dfauwV gvmHSW"
                     xmlns="http://www.w3.org/2000/svg">
                    <g id="Book">
                        <path fill="currentColor" fill-rule="nonzero"
                              d="M187 140.625V9.375C187 4.1797 182.8203 0 177.625 0H49.5C28.7969 0 12 16.7969 12 37.5v125c0 20.7031 16.7969 37.5 37.5 37.5h128.125c5.1953 0 9.375-4.1797 9.375-9.375v-6.25c0-2.9297-1.3672-5.586-3.4766-7.3047-1.6406-6.0156-1.6406-23.164 0-29.1797 2.1094-1.6797 3.4766-4.336 3.4766-7.2656zM62 52.3437C62 51.0547 63.0547 50 64.3438 50h82.8124c1.2891 0 2.3438 1.0547 2.3438 2.3438v7.8124c0 1.2891-1.0547 2.3438-2.3438 2.3438H64.3438C63.0547 62.5 62 61.4453 62 60.1562v-7.8124zm0 25C62 76.0547 63.0547 75 64.3438 75h82.8124c1.2891 0 2.3438 1.0547 2.3438 2.3438v7.8124c0 1.2891-1.0547 2.3438-2.3438 2.3438H64.3438C63.0547 87.5 62 86.4453 62 85.1562v-7.8124zM160.9844 175H49.5c-6.914 0-12.5-5.586-12.5-12.5 0-6.875 5.625-12.5 12.5-12.5h111.4844c-.7422 6.6797-.7422 18.3203 0 25z"></path>
                    </g>
                </svg>

                <span className={styles.badgeText}>{text}</span>
            </div>
        </Flex>
    )
}
