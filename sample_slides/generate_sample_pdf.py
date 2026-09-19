import os
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def build_ml_slides(output_path="sample_slides/ml_lecture_slides.pdf"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=landscape(letter),
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'SlideTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#1E1E24')
    )
    
    subtitle_style = ParagraphStyle(
        'SlideSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#2563EB')
    )

    body_style = ParagraphStyle(
        'SlideBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=17,
        textColor=colors.HexColor('#1E1E24')
    )

    badge_style = ParagraphStyle(
        'SlideBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=colors.HexColor('#FCFBF7')
    )

    slides_content = [
        {
            "num": "01 / 05",
            "topic": "DEEP LEARNING FOUNDATIONS",
            "title": "Neural Networks & Backpropagation Dynamics",
            "bullets": [
                "<b>Perceptron</b>: The fundamental biological-inspired building block of artificial intelligence models.",
                "<b>Activation Function</b>: Non-linear transformations such as <b>ReLU</b>, <b>Sigmoid</b>, and <b>Softmax</b> allow models to learn intricate boundaries.",
                "<b>Gradient Descent</b>: An optimization algorithm iteratively tuning network <b>weights</b> to minimize empirical loss.",
                "<b>Backpropagation</b>: Efficiently calculates error derivatives from output layer backwards using the chain rule.",
                "<b>Overfitting</b>: Occurs when high model capacity memorizes training noise instead of general patterns."
            ],
            "key_terms": ["Perceptron", "Activation", "Gradient", "Backpropagation", "Overfitting", "Weights", "Sigmoid", "Softmax"]
        },
        {
            "num": "02 / 05",
            "topic": "SUPERVISED LEARNING & ENSEMBLES",
            "title": "Decision Trees, Random Forests & Boosting",
            "bullets": [
                "<b>Decision Tree</b>: Hierarchical recursive partitioning using <b>entropy</b> and information gain splits.",
                "<b>Bagging</b>: Bootstrap aggregation combining multiple independent parallel estimators like <b>Random Forest</b>.",
                "<b>Boosting</b>: Sequential ensemble learning where weak learners focus on previous prediction errors.",
                "<b>AdaBoost</b>: Dynamically reweights misclassified sample points across subsequent training rounds.",
                "<b>Gradient Boosting</b>: Fits subsequent base trees directly against the pseudo-residuals of the loss function."
            ],
            "key_terms": ["Decision", "Tree", "Ensemble", "Boosting", "Forest", "Entropy", "Residuals", "Variance"]
        },
        {
            "num": "03 / 05",
            "topic": "COMPUTER VISION & SPATIAL PATTERNS",
            "title": "Convolutional Neural Networks (CNNs)",
            "bullets": [
                "<b>Convolution</b>: Sliding parameterized filter kernels across 2D spatial pixel tensors to detect visual cues.",
                "<b>Kernel</b>: Small matrix of learnable weights tuned to extract edges, textures, and corner gradients.",
                "<b>Feature Map</b>: The resulting activation matrix highlighting specific visual cues at spatial coordinates.",
                "<b>Pooling Layer</b>: Downsamples spatial dimensions using max-pooling or average-pooling to achieve translation invariance.",
                "<b>Receptive Field</b>: The localized sensory patch of original input image influencing a deeper neuron."
            ],
            "key_terms": ["Convolution", "Kernel", "Pooling", "Filter", "Invariance", "Pixels", "Tensors", "Edges"]
        },
        {
            "num": "04 / 05",
            "topic": "NATURAL LANGUAGE PROCESSING",
            "title": "Transformers & Self-Attention Mechanisms",
            "bullets": [
                "<b>Transformer</b>: Sequence-to-sequence architecture relying entirely on attention without recurrent loops.",
                "<b>Self-Attention</b>: Computes pairwise relevance between token embeddings using Query, Key, and Value vectors.",
                "<b>Multi-Head Attention</b>: Enables representations to jointly attend to information across different subspace perspectives.",
                "<b>Tokenizer</b>: Segments continuous natural language strings into subword tokens and integer vocab IDs.",
                "<b>Positional Encoding</b>: Injects sequential order and positional coordinate information into invariant embeddings."
            ],
            "key_terms": ["Transformer", "Attention", "Tokenizer", "Embedding", "Tokens", "Vectors", "Encoder", "Decoder"]
        },
        {
            "num": "05 / 05",
            "topic": "REINFORCEMENT LEARNING",
            "title": "Autonomous Agents, Policy & Q-Learning",
            "bullets": [
                "<b>Agent & Environment</b>: The dynamic interactive feedback loop where an agent observes state and takes action.",
                "<b>Reward Function</b>: Scalar numerical signal guiding an agent toward optimal behavior and goal completion.",
                "<b>Policy</b>: The probabilistic mapping defining an agent's strategy from perceived state to action choice.",
                "<b>Q-Learning</b>: Model-free off-policy algorithm estimating maximum expected future discounted returns.",
                "<b>Exploration vs Exploitation</b>: Balancing trying novel speculative actions versus executing known high-reward actions."
            ],
            "key_terms": ["Agent", "Reward", "Policy", "Exploration", "Environment", "State", "Action", "Discount"]
        }
    ]

    elements = []
    
    for i, slide in enumerate(slides_content):
        # Header banner table
        header_data = [
            [
                Paragraph(f"<b>{slide['topic']}</b>", subtitle_style),
                Paragraph(f"<b>SLIDE {slide['num']}</b>", ParagraphStyle('RightNum', parent=subtitle_style, alignment=2, textColor=colors.HexColor('#FF4B82')))
            ]
        ]
        t_header = Table(header_data, colWidths=[500, 220])
        t_header.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        elements.append(t_header)

        # Slide Title
        elements.append(Paragraph(slide['title'], title_style))
        elements.append(Spacer(1, 14))

        # Bullet items inside nice styled card
        bullet_paras = []
        for bullet in slide['bullets']:
            bullet_paras.append(Paragraph(f"• &nbsp; {bullet}", body_style))
            bullet_paras.append(Spacer(1, 6))

        # Terms bar
        terms_label = Paragraph("<b>🎯 KEY STUDY TERMS FOR DOODLING:</b>", ParagraphStyle('TL', parent=subtitle_style, fontSize=11, textColor=colors.HexColor('#1E1E24')))
        terms_content = " &nbsp; | &nbsp; ".join([f"<b>{term}</b>" for term in slide['key_terms']])
        terms_p = Paragraph(f"<font color='#FF4B82'>{terms_content}</font>", ParagraphStyle('TC', parent=body_style, fontSize=11))

        content_table_data = [
            [bullet_paras],
            [Spacer(1, 10)],
            [terms_label],
            [terms_p]
        ]
        t_content = Table(content_table_data, colWidths=[720])
        t_content.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FCFBF7')),
            ('BOX', (0,0), (-1,-1), 2.5, colors.HexColor('#1E1E24')),
            ('TOPPADDING', (0,0), (-1,-1), 16),
            ('BOTTOMPADDING', (0,0), (-1,-1), 16),
            ('LEFTPADDING', (0,0), (-1,-1), 18),
            ('RIGHTPADDING', (0,0), (-1,-1), 18),
        ]))
        elements.append(t_content)

        if i < len(slides_content) - 1:
            from reportlab.platypus import PageBreak
            elements.append(PageBreak())

    doc.build(elements)
    print(f"Successfully generated sample lecture slides at: {output_path}")

if __name__ == "__main__":
    build_ml_slides()
