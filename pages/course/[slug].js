import * as contentful from "../../utils/contentful"
import {Accordion} from '@contentful/f36-components';
import {Box, Flex, Image, VStack} from '@chakra-ui/react'
import {useState} from "react";
import styles from '../../styles/Course.module.css'
import Badge from "./components/badge";
import ActivityCard from "./components/activityCard";

export default function CoursePage({gradeGroup, courseName}) {

    const setOfLevel = new Set();

    Object.values(gradeGroup).flat().flat().map((it) => {
        setOfLevel.add(it.levelTitle)
    })

    const [accordionState, setAccordionState] = useState({});

    const handleExpand = (itemIndex) => () => {
        setAccordionState((state) => ({...state, [itemIndex]: true}));
    };

    const handleCollapse = (itemIndex) => () => {
        setAccordionState((state) => ({...state, [itemIndex]: false}));
    };

    return (
        <>
            <div>
                <div style={{marginLeft: '10px', display: 'inline-block'}}>
                    <h2>{courseName}</h2>
                </div>
                <div style={{marginLeft: '5px', display: 'inline-block'}}>({setOfLevel.size})</div>
            </div>
            {/*<Box pb="6px">*/}
            {/*    <Flex gap={2}>*/}
            {/*        <h2 className={styles.headerTitle}>*/}
            {/*            {courseName}*/}
            {/*        </h2>*/}
            {/*        <p>*/}
            {/*            ({setOfLevel.size})*/}
            {/*        </p>*/}
            {/*    </Flex>*/}
            {/*</Box>*/}
            <VStack marginTop={30} gap="8px" w="100%">
                <Accordion align={"start"} className={styles.accordion}>
                    {Object.entries(gradeGroup).map(([key, value], index) => (
                        <Accordion.Item key={key}
                                        isExpanded={accordionState[index] == null ? false : accordionState[index]}
                                        onExpand={handleExpand(index)}
                                        onCollapse={handleCollapse(index)}
                                        className={styles.accordion__item}
                                        border="none"
                                        title={
                                            <Box>
                                                <div style={{
                                                    display: 'inline',
                                                    fontSize: '1.3em',
                                                    marginRight: '10px'
                                                }}>{key}</div>
                                                <div style={{
                                                    display: 'inline',
                                                    fontSize: '0.8em'
                                                }}>{value.length} Levels
                                                </div>
                                                <div><Badge/></div>
                                            </Box>
                                        }>
                            <div key={key}>
                                <Box marginTop={10}>
                                    <Accordion align={"start"} className={styles.accordion__item}>
                                        <Box className={styles.level__container}>
                                            <Box w="80px" p="19px 16px 16px" background="rgb(229, 247, 253)">
                                                <Flex h={18}>
                                                    <Image
                                                        src={'../AlgebraAndAlgebricThinking.svg'}
                                                        alt={'Image Not Found'}/>
                                                    <h4>1</h4>
                                                </Flex>
                                            </Box>
                                            <Box w="100%" styles={styles.level__row}>
                                                {value.map((activitiesData) => (
                                                        <Accordion.Item key={activitiesData}
                                                                        title={<Flex gap={8} alignItems="center">
                                                                            <h3>{activitiesData[0].levelTitle}</h3>
                                                                        </Flex>}>
                                                            {activitiesData.map((data) => (
                                                                <Box display="inline-block" key={data}>
                                                                    <ActivityCard data={data}/>
                                                                </Box>
                                                            ))
                                                            }
                                                        </Accordion.Item>
                                                    )
                                                )}
                                            </Box>
                                        </Box>
                                    </Accordion>
                                </Box>
                            </div>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </VStack>
        </>
    )
}


async function getActivityDataFromLevel(level) {
    let pathwayActivityIds = level.fields.pathwayActivities.map((it => it.sys.id));
    //TODO : improve here making separate call for each id
    let activity = []
    await Promise.all(pathwayActivityIds.map(async (it) => {
            const pathwayActivity = await contentful.previewClient.getEntry(it);
            activity.push(pathwayActivity.fields.activity)
        })
    )
    return activity.map((it) => {
        return {
            levelTitle: level.fields.title,
            imageURL: it.fields.image.fields.file.url,
            activityTitle: it.fields.title
        }
    })
}


export async function getServerSideProps(context) {

    let code = context.params;
    const course = await contentful.previewClient
        .getEntries({
            content_type: 'course',
            limit: 1,
            "fields.code": code,
        })
    const levels = course.items[0].fields.levels;
    console.log('levels', levels)
    //Group by grade levels
    let gradeGroup = await levels?.reduce(async (groupPromise, level) => {
        const group = await groupPromise;
        let gradeLevels = level.fields.gradeLevel;

        for (const it of gradeLevels) {
            if (group[it] == null) {
                group[it] = [];
            }
            group[it].push(await getActivityDataFromLevel(level));
        }

        return group;
    }, Promise.resolve({}));
    return (
        {
            props: {
                gradeGroup,
                courseName: course.items[0].fields.name
            }
        }
    )
}
