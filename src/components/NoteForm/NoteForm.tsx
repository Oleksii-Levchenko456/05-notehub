import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormikHelpers } from "formik";
import { createNote } from "../../services/noteService";
import css from "./NoteForm.module.css";

interface FormikValues {
    title: string;
    content: string;
    tag: string;
}

interface NoteFormProps {
    onClose: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}

const initialValues: FormikValues = {
    title: "",
    content: "",
    tag: "",
};

const validationSchema = Yup.object({
    title: Yup.string()
        .min(3, "Title must be at least 3 characters")
        .max(50, "Title is too long")
        .required("Title is required"),
    content: Yup.string().max(500),
    tag: Yup.string()
        .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
        .required("Please choose a tag"),
});

function useCreateNote(onClose: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            onClose();
        },
        onError: (error) => {
            console.error("Failed to create note:", error);
        },
    });
}


export default function NoteForm({ onClose }: NoteFormProps) {
    const mutation = useCreateNote(onClose);

    const handleSubmit = (
        values: FormikValues,
        actions: FormikHelpers<FormikValues>
    ) => {
        mutation.mutate(values, {
            onSettled: () => actions.resetForm()
        });


    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className={css.form}>
                    <div className={css.formGroup}>
                        <label htmlFor="title">Title</label>
                        <Field id="title" name="title" type="text" className={css.input} />
                        <ErrorMessage name="title" component="div" className={css.error} />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="content">Content</label>
                        <Field
                            as="textarea"
                            id="content"
                            name="content"
                            rows={8}
                            className={css.textarea}
                        />
                        <ErrorMessage
                            name="content"
                            component="div"
                            className={css.error}
                        />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="tag">Tag</label>
                        <Field as="select" id="tag" name="tag" className={css.select}>
                            <option value="">Choose tag..</option>
                            <option value="Todo">Todo</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Meeting">Meeting</option>
                            <option value="Shopping">Shopping</option>
                        </Field>
                        <ErrorMessage name="tag" component="div" className={css.error} />
                    </div>

                    <div className={css.actions}>
                        <button
                            type="button"
                            className={css.cancelButton}
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={css.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create note"}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
