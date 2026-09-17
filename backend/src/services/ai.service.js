const {GoogleGenAI} = require("@google/genai");
const z = require("zod");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
});

// async function invokeAI(){
//     const response = await ai.models.generateContent({
//         model:"gemini-3.1-flash-lite",
//         contents:"Hello! Can you tell me my name",
//     });

//     console.log(response.text);
// }

const reportJsonSchema= {
    type:"object",
    properties:{
        matchScore:{
            type:"integer",
            description:"The match score of job description and resume between 0 to 100"
        },
        technicalQuestions:{
            type:"array",
            items:{
                type:"object",
                properties:{
                    question:{
                        type:"string",
                        description:"The question interviewer may ask to test your technical knowledge according to job description"
                    },
                    intention:{
                        type:"string",
                        description:"The intention of interviewer behind asking that question"
                    },
                    answer:{
                        type:"string",
                        description:"How should the candidate answer the question, what should be the structure, points and keywords"
                    }
                },
                required:["question","answer","intention"]
            }
        },
        behaviouralQuestions:{
            type:"array",
            items:{
                type:"object",
                properties:{
                    question:{
                        type:"string",
                        description:"The behavioural question interviewer may ask to test your behaviour for their company ethics"
                    },
                    intention:{
                        type:"string",
                        description:"The intention of the interviewer behind asking that question"
                    },
                    answer:{
                        type:"string",
                        description:"how should the canditate answer that question what should be the approach, points and keywords to impress the interviewer"
                    }
                },
                required:["question","intention","answer"]
            }
        },
        skillGaps:{
            type:"array",
            items:{
                type:"object",
                properties:{
                    skill:{
                        type:"string",
                        description:"What are the skill gaps does candidate have to get that job"
                    },
                    severnity:{
                        type:"string",
                        description:"This is the enum answer only in low, medium and high that what is the severnity of that skill according to job description"
                    }
                },
                required:["skill","severnity"]
            }
        },
        preperationPlan:{
            type:"array",
            items:{
                type:"object",
                properties:{
                    day:{
                        type:"integer",
                        description:"At which day candidate should prepare for what"
                    },
                    focus:{
                        type:"string",
                        description:"What topic should candidate primarily focus on that day"
                    },
                    tasks:{
                        type:"array",
                        items:{type:"string"},
                        description:"What tasks should be done on that day"
                    }
                },
                required:["day","focus","tasks"]
            }
        },
        jobTitle:{
            type:"string",
            description:"The job title for which the candidate is applying for"
        },
    },
    required:["matchScore","technicalQuestions", "behaviouralQuestions", "skillGaps","preperationPlan", "jobTitle"]
}

const reportSchema = z.fromJSONSchema(reportJsonSchema);

async function generateReport({resume, selfDescription, jobDescription}){
    const prompt=`You are an expert technical recruiter, hiring manager, and career coach.

    Your task is to evaluate a candidate's fit for a job using the candidate's resume, self-description, and the job description.

    IMPORTANT RULES:
    1. Use only the information provided in the resume, self-description, and job description.
    2. Do not invent experience, achievements, skills, or certifications that are not explicitly mentioned.
    3. If information is missing, infer conservatively and note the gap.
    4. Be realistic, objective, and professional.
    5. Focus on actual job relevance, not generic advice.
    6. The output must be valid JSON and must match the schema exactly.
    7. Return only JSON, with no markdown, no commentary, and no extra text before or after.

    INPUTS:
    - Resume:
    ${resume}
    - Self Description:
    ${selfDescription}
    - Job Description:
    ${jobDescription}

    EVALUATION OBJECTIVES:
    - Calculate a realistic match score from 0 to 100 based on skill alignment, experience relevance, responsibilities, domain fit, and role suitability.
    - Identify the likely technical interview questions a recruiter or interviewer would ask based on the job description.
    - Identify the likely behavioral/interview questions that test alignment with company values, teamwork, communication, conflict handling, and problem-solving.
    - Explain the intention behind each question and provide a strong candidate answer structure.
    - Identify skill gaps and rate severity as one of: "low", "medium", or "high".
    - Create a practical preparation plan with day-by-day focus and tasks.

    QUALITY EXPECTATIONS:
    - matchScore should reflect a fair, evidence-based assessment.
    - technicalQuestions should be directly relevant to the job role and candidate profile.
    - behaviouralQuestions should test teamwork, communication, ownership, learning agility, handling ambiguity, stakeholder management, and fit with role expectations.
    - answers should be actionable and structured, not vague.
    - skillGaps should prioritize the biggest blockers for this role.
    - preperationPlan should be realistic, progressive, and actionable over a short preparation window.
    - Use clear, concise, interview-ready language.
    - Ensure every field is present and valid JSON is produced.

    Return only the final JSON.`;

    const interaction = await ai.interactions.create({
        model:"gemini-3.1-flash-lite",
        input:prompt,
        response_format:{
            type:"text",
            mime_type:"application/json",
            schema:reportJsonSchema
        }
    });

    const report= reportSchema.parse(JSON.parse(interaction.output_text));
    return report;
}

async function htmlToPdf(htmlContent){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, {waitUntil:"networkidle0"});
    const pdfBuffer = await page.pdf({
        format:"A4",
        printBackground:true,
        margin:{
            top:"20mm",
            bottom:"20mm",
            left:"15mm",
            right:"15mm"
        } 
    });
    
    await browser.close();
    return pdfBuffer;
}

async function updateResume({report}){
    const prompt = `
                You are an expert resume writer and professional document designer.

                Create a tailored, truthful, ATS-friendly resume in HTML using the candidate's original resume, target job description, and interview analysis report.

                RULES:
                - Use only facts from the original resume and report.
                - Never invent skills, experience, employers, dates, certifications, achievements, or metrics.
                - Improve wording naturally while preserving the candidate's authentic voice.
                - Tailor relevant skills and experience to the target job without keyword stuffing.
                - Remove irrelevant repetition and vague AI-like language.
                - Use concise, human-sounding accomplishment bullets.
                - Do not mention AI, this prompt, the report, or the tailoring process.
                - Do not include a photo, icons, charts, progress bars, rating graphics, or unsupported claims.
                - Make the resume suitable for conversion to PDF with Puppeteer.
                - Use semantic HTML and clean, professional typography.
                - Make the layout printable on A4 paper.
                - Use only inline CSS inside a single <style> element.
                - Do not use external fonts, external stylesheets, JavaScript, images, SVGs, or remote assets.
                - Ensure the design is readable in black and white.
                - Escape all HTML special characters correctly.

                HTML REQUIREMENTS:
                - Return only a complete HTML document.
                - Include <!DOCTYPE html>, <html>, <head>, <meta charset="UTF-8">, <title>, and <body>.
                - Use semantic elements such as header, main, section, h1, h2, h3, ul, and li.
                - Keep the resume compact enough for approximately one or two pages.
                - Use print-friendly CSS with A4 page sizing and sensible margins.
                - Avoid page breaks inside individual experience entries where possible.
                - Do not use Markdown.
                - Do not wrap the response in triple backticks.
                - Return HTML only. The first characters must be <!DOCTYPE html> and the final characters must be </html>.

                ORIGINAL RESUME:
                ${report.resume}

                TARGET JOB DESCRIPTION:
                ${report.jobDescription}

                INTERVIEW ANALYSIS REPORT:
                ${JSON.stringify(report, null, 2)}
    `;

    const interaction = await ai.interactions.create({
        model:"gemini-3.1-flash-lite",
        input:prompt,
        response_format:{
            type:"text",
            mime_type:"text/html"
        }
    });

    const resumeHtml =interaction.output_text.trim();
    return htmlToPdf(resumeHtml);
}

module.exports={generateReport, updateResume};