import * as contentful from "../../utils/contentful"


export default async function handler(req, res) {
    const { secret, code } = req.query
    console.log("course code: ", code)
    console.log("secret: ", secret)

    if (!code) {
        return res.status(401).json({ message: 'Invalid token' })
    }
    const course = await contentful.client
        .getEntries({
            content_type: 'course',
            limit: 1,
            "fields.code": code,
        })
    if (!course.items.length) {
        return res.status(401).json({ message: 'Invalid course code' })
    }
    const pageFields = course.items[0].fields

    res.setPreviewData({})
    res.redirect(`/course/${pageFields.code}`)
}
