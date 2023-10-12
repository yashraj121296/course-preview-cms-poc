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
                    <h2 style={{
                        fontWeight: 700,
                        fontFamily: 'Signika, sans-serif',
                        fontSize: '24px',
                        lineHeight: '30px',
                    }}>{courseName}</h2>
                </div>
                <div style={{marginLeft: '5px', display: 'inline-block'}}>({setOfLevel.size})</div>
            </div>
            <VStack gap="8px" w="100%">
                <Accordion align={"start"} className={styles.accordion}>
                    {Object.entries(gradeGroup).map(([key, value], index) => (
                        <Accordion.Item key={key}
                                        isExpanded={accordionState[index] == null ? false : accordionState[index]}
                                        onExpand={handleExpand(index)}
                                        onCollapse={handleCollapse(index)}
                                        className={styles.accordion__item}
                                        border="none"
                                        title={
                                            <Flex justify="space-between" w="100%" align="center">
                                                <div>
                                                    <div style={{
                                                        display: 'inline',
                                                        fontWeight: 700,
                                                        fontFamily: 'Signika',
                                                        fontSize: '16px',
                                                        lineHeight: '20px',
                                                        marginRight: '10px'
                                                    }}>{key}</div>
                                                    <div style={{
                                                        display: 'inline',
                                                        fontWeight: 300,
                                                        fontFamily: 'Signika',
                                                        fontSize: '16px',
                                                        lineHeight: '20px',
                                                    }}>{value.length} Levels
                                                    </div>
                                                </div>
                                            </Flex>
                                        }>
                            <div key={key}>
                                <Box marginTop={10}>
                                    <Accordion align={"start"} className={styles.accordion__item}>

                                        <Box w="100%">
                                            {value.map((activitiesData, order) => {
                                                    const domain = activitiesData[0].domainTagging[0].toString()
                                                    return (
                                                        <Accordion.Item key={activitiesData}
                                                                        className={styles.accordion__header}
                                                                        title={
                                                                            <Flex gap={getDomainData(domain).image ? 8 : 0}
                                                                                  alignItems="center">
                                                                                <Box
                                                                                    minWidth={
                                                                                        getDomainData(domain).image
                                                                                            ? '80px'
                                                                                            : '1px'
                                                                                    }
                                                                                    p="19px 16px 16px"
                                                                                    color={getDomainData(domain).color}
                                                                                    background={getDomainData(domain).background}
                                                                                >
                                                                                    <Flex h={18}>
                                                                                        {getDomainData(domain).image && (
                                                                                            <>
                                                                                                <Image
                                                                                                    src={getDomainData(domain).image}
                                                                                                    alt={'Domain'}
                                                                                                />
                                                                                                <h4>{order + 1}</h4>
                                                                                            </>
                                                                                        )}
                                                                                    </Flex>
                                                                                </Box>

                                                                                <h3 style={{
                                                                                    fontWeight: 700,
                                                                                    fontFamily: 'Signika',
                                                                                    fontSize: '16px',
                                                                                    lineHeight: '20px',
                                                                                    margin: 0
                                                                                }}>{activitiesData[0].levelTitle}</h3>
                                                                            </Flex>}>
                                                            <Flex w="100%">
                                                                {getDomainData(domain).image && (
                                                                    <Box minWidth="80px" p="19px 16px 16px"
                                                                         background={getDomainData(domain).background}>
                                                                    </Box>
                                                                )}
                                                                <Box className={styles.container}>
                                                                    {activitiesData.map((data) => (
                                                                        <Box display="inline-block" key={data}>
                                                                            <ActivityCard data={data}/>
                                                                        </Box>
                                                                    ))
                                                                    }
                                                                </Box>
                                                            </Flex>
                                                        </Accordion.Item>
                                                    )
                                                }
                                            )}
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
            activityTitle: it.fields.title,
            domainTagging: level.fields.domainTagging
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

export const getDomainData = (type) => {
    let typeData = {
        background: '',
        image: '',
        color: '',
    };
    switch (type) {
        case 'Algebra and Algebraic Thinking':
            typeData = {
                background: 'rgb(229, 248, 240)',
                image: '../AlgebraAndAlgebricThinking.svg',
                color: 'rgb(0, 74, 42)',
            };
            break;
        case 'Geometry':
            typeData = {
                background: 'rgb(229, 247, 253)',
                image: '../Geometry.svg',
                color: 'rgb(0, 73, 94)',
            };
            break;
        case 'Numbers and Operations':
            typeData = {
                background: 'rgb(255, 238, 229)',
                image: '../NumbersAndOperations.svg',
                color: 'rgb(102, 34, 0)',
            };
            break;
        default:
            typeData = {
                background: '#fff',
                image: '',
                color: '#fff',
            };
    }

    return typeData;
};
