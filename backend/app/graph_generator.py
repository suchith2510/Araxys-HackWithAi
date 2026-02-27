"""
graph_generator.py
------------------
Generates visualizations from lab report trend data.
Uses matplotlib (Agg backend) to generate base64 encoded PNGs
that can be returned directly in the API response.
"""

import base64
import io
import matplotlib

# Use Agg backend for thread-safe non-GUI rendering (crucial for web servers)
matplotlib.use('Agg')

import matplotlib.pyplot as plt


def generate_trend_graph_base64(trends: list[dict]) -> str | None:
    """
    Generate a horizontal bar chart of percentage changes for lab parameters.
    Returns the base64 data URI for the PNG image, or None if no valid data.
    """
    valid_trends = [
        t for t in trends 
        if t.get('percentage_change') is not None and t['percentage_change'] != 0
    ]
    
    if not valid_trends:
        return None
        
    # Sort by absolute percentage change to highlight the biggest movers
    valid_trends.sort(key=lambda x: abs(x['percentage_change']), reverse=True)
    
    # Cap at top 10 parameters to keep graph readable
    top_trends = valid_trends[:10]
    
    names = [t['name'] for t in top_trends]
    pct_changes = [t['percentage_change'] for t in top_trends]
    
    # Colors: Decreased (cool teal), Increased (warm coral)
    colors = ['#ff6b6b' if p > 0 else '#4ecdc4' for p in pct_changes]
    
    fig, ax = plt.subplots(figsize=(10, max(4, len(names) * 0.7)))
    
    bars = ax.barh(names, pct_changes, color=colors, height=0.6)
    
    # Add a zero line
    ax.axvline(0, color='black', linewidth=1, alpha=0.3)
    
    # Styling
    ax.set_xlabel('Percentage Change (%)', fontsize=12, fontweight='bold', color='#444444')
    ax.set_title('Top Lab Parameter Changes (Oldest vs Newest)', fontsize=15, fontweight='bold', pad=20, color='#222222')
    
    # Invert y-axis so the largest change starts at the top
    ax.invert_yaxis()
    
    # Remove most borders for a cleaner look
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#cccccc')
    ax.spines['bottom'].set_color('#cccccc')
    
    ax.tick_params(axis='x', colors='#666666', labelsize=10)
    ax.tick_params(axis='y', colors='#333333', labelsize=11, length=0) # hide y ticks
    ax.set_axisbelow(True)
    ax.xaxis.grid(color='#eeeeee', linestyle='dashed')
    
    # Add value labels to bars
    for bar in bars:
        width = bar.get_width()
        # Offset label based on bar direction
        label_x_pos = width + (max(abs(width) * 0.05, 1) if width > 0 else -max(abs(width) * 0.05, 1))
        ha = 'left' if width > 0 else 'right'
        
        # Add a plus sign for positive numbers
        val_str = f"+{width:.1f}%" if width > 0 else f"{width:.1f}%"
        
        ax.text(label_x_pos, bar.get_y() + bar.get_height()/2, 
                val_str, ha=ha, va='center', fontsize=11, 
                fontweight='bold', color='#555555')
        
    # Expand x-limits to fit the text labels
    x_min, x_max = ax.get_xlim()
    ax.set_xlim(min(x_min * 1.3, -5), max(x_max * 1.3, 5))
    
    plt.tight_layout()
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=120, bbox_inches='tight', transparent=False, facecolor='white')
    plt.close(fig)
    buf.seek(0)
    
    # Encode as explicit data URI (can be placed directly into an img src)
    img_b64 = base64.b64encode(buf.read()).decode('utf-8')
    return f"data:image/png;base64,{img_b64}"
